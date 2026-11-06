import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { getMongoDatabase } from "@/lib/mongodb/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idToken = typeof body.idToken === "string" ? body.idToken : "";

    if (!idToken) {
      return NextResponse.json(
        { error: "Thiếu Firebase ID Token." },
        { status: 400 }
      );
    }

    const decoded = await verifyFirebaseIdToken(idToken);

    const userRecord = {
      uid: decoded.uid,
      email: decoded.email || null,
      displayName: decoded.name || null,
      photoURL: decoded.picture || null,
      provider: decoded.firebase?.sign_in_provider || "google.com",
      lastLoginAt: new Date().toISOString(),
    };

    // Lưu / cập nhật thông tin tài khoản Google vào MongoDB
    const db = await getMongoDatabase();
    if (db) {
      await db.collection("users").updateOne(
        { uid: decoded.uid },
        {
          $set: userRecord,
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: userRecord,
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
