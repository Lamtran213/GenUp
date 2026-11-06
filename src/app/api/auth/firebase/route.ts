import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { getMongoDatabase } from "@/lib/mongodb/client";

function getSupabaseServerAdminOrAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
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

    // 1. Lưu / cập nhật thông tin tài khoản Google & Hồ sơ Học sinh vào Supabase PostgreSQL
    let supabaseSynced = false;
    let supabaseDetails: unknown = null;
    const supabase = getSupabaseServerAdminOrAnon();

    if (supabase) {
      const { data: rpcData, error: rpcError } = await supabase.rpc(
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
        supabaseDetails = rpcData;
      } else {
        supabaseDetails = rpcError.message;
      }
    }

    // 2. Lưu / cập nhật thông tin tài khoản Google vào MongoDB
    const db = await getMongoDatabase();
    if (db) {
      await db.collection("users").updateOne(
        { uid: decoded.uid },
        {
          $set: { ...userRecord, supabaseSynced },
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: userRecord,
      supabaseSynced,
      supabaseDetails,
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
