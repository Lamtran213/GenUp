import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { getMongoDatabase } from "@/lib/mongodb/client";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function deriveSupabasePassword(firebaseUid: string): string {
  const secret = process.env.CRON_SECRET || "genup_default_bridge_secret";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(firebaseUid)
    .digest("hex")
    .slice(0, 24);
  return `Gu!${hash}9A`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idToken = typeof body.idToken === "string" ? body.idToken : "";
    const nickname =
      typeof body.nickname === "string" && body.nickname.trim()
        ? body.nickname.trim()
        : undefined;
    const grade =
      typeof body.grade === "number" && body.grade >= 6 && body.grade <= 9
        ? body.grade
        : 7;

    if (!idToken) {
      return NextResponse.json(
        { error: "Thiếu Firebase ID Token." },
        { status: 400 }
      );
    }

    const decoded = await verifyFirebaseIdToken(idToken);

    const email = decoded.email || `${decoded.uid}@firebase.genup.local`;
    const fullName =
      decoded.name || email.split("@")[0] || "Người dùng Google GenUp";

    const userRecord = {
      uid: decoded.uid,
      email,
      displayName: fullName,
      photoURL: decoded.picture || null,
      provider: decoded.firebase?.sign_in_provider || "google.com",
      lastLoginAt: new Date().toISOString(),
    };

    // 1. Đồng bộ tài khoản Google vào Supabase Auth (auth.users) + bảng public.user_accounts & public.student_profiles
    let supabaseSynced = false;
    let supabaseAuthUserId: string | null = null;
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const bridgePassword = deriveSupabasePassword(decoded.uid);

      // 1a. Đăng nhập hoặc tạo user trong Supabase Authentication (auth.users)
      const signInRes = await supabase.auth.signInWithPassword({
        email,
        password: bridgePassword,
      });

      if (signInRes.data?.user) {
        supabaseAuthUserId = signInRes.data.user.id;
        supabaseSynced = true;
      } else {
        const signUpRes = await supabase.auth.signUp({
          email,
          password: bridgePassword,
          options: {
            data: {
              full_name: fullName,
              avatar_url: decoded.picture || null,
              firebase_uid: decoded.uid,
              provider: "google.com",
            },
          },
        });
        if (signUpRes.data?.user) {
          supabaseAuthUserId = signUpRes.data.user.id;
          supabaseSynced = true;
        }
      }

      // 1b. Gọi hàm RPC đồng bộ vào bảng public.user_accounts & public.student_profiles
      const { error: rpcError } = await supabase.rpc(
        "sync_firebase_google_user",
        {
          p_firebase_uid: decoded.uid,
          p_email: email,
          p_full_name: fullName,
          p_avatar_url: decoded.picture || null,
          p_nickname: nickname || fullName,
          p_grade: grade,
        }
      );

      if (!rpcError) {
        supabaseSynced = true;
      } else if (supabaseAuthUserId) {
        // Fallback nếu chưa chạy RPC mới: ghi trực tiếp bằng phiên authenticated của Supabase
        await supabase.from("user_accounts").upsert(
          {
            id: supabaseAuthUserId,
            email,
            full_name: fullName,
            role: "Parent",
          },
          { onConflict: "id" }
        );
      }
    }

    // 2. Lưu / cập nhật thông tin tài khoản Google vào MongoDB
    const db = await getMongoDatabase();
    if (db) {
      await db.collection("users").updateOne(
        { uid: decoded.uid },
        {
          $set: {
            ...userRecord,
            supabaseAuthUserId,
            supabaseSynced,
          },
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: userRecord,
      supabaseAuthUserId,
      supabaseSynced,
    });

    response.cookies.set("genup_firebase_uid", decoded.uid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 ngày
    });

    return response;
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Xác thực Firebase ID Token không hợp lệ.",
      },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("genup_firebase_uid");
  return response;
}
