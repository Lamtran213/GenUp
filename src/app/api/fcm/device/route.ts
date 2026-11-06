import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getMongoDatabase } from "@/lib/mongodb/client";
import { sendMobilePushNotification } from "@/lib/firebase/admin";

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

/**
 * GET /api/fcm/device
 * Lấy danh sách thiết bị (Web / Android / iOS) đã đăng ký nhận FCM Push
 */
export async function GET(req: NextRequest) {
  const firebaseUid =
    req.nextUrl.searchParams.get("firebaseUid") ||
    req.cookies.get("genup_firebase_uid")?.value ||
    "";

  const db = await getMongoDatabase();
  if (!db) {
    return NextResponse.json({ devices: [] });
  }

  const filter = firebaseUid ? { firebaseUid } : {};
  const devices = await db
    .collection("fcm_devices")
    .find(filter)
    .sort({ updatedAt: -1 })
    .limit(20)
    .toArray();

  return NextResponse.json({ devices });
}

/**
 * POST /api/fcm/device
 * Dùng cho cả Web App và Mobile App (Android / iOS / React Native / Flutter)
 * để đăng ký fcmToken lên MongoDB & Supabase (bảng public.user_devices).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fcmToken = typeof body.fcmToken === "string" ? body.fcmToken.trim() : "";
    const platform =
      body.platform === "android" || body.platform === "ios"
        ? body.platform
        : "web";
    const firebaseUid =
      body.firebaseUid ||
      req.cookies.get("genup_firebase_uid")?.value ||
      "anonymous";
    const deviceName =
      typeof body.deviceName === "string" ? body.deviceName : platform.toUpperCase();

    if (!fcmToken) {
      return NextResponse.json(
        { ok: false, error: "Thiếu fcmToken." },
        { status: 400 }
      );
    }

    const record = {
      fcmToken,
      platform,
      firebaseUid,
      deviceName,
      updatedAt: new Date().toISOString(),
    };

    // 1. Lưu vào MongoDB (collection: fcm_devices)
    const db = await getMongoDatabase();
    if (db) {
      await db.collection("fcm_devices").updateOne(
        { fcmToken },
        {
          $set: record,
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );
    }

    // 2. Đồng bộ vào bảng public.user_devices của Supabase (nếu có)
    const supabase = getSupabaseServerClient();
    if (supabase) {
      await supabase
        .from("user_devices")
        .upsert(
          {
            fcm_token: fcmToken,
            platform,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "fcm_token" }
        )
        .catch(() => null);
    }

    // 3. Nếu yêu cầu gửi thông báo chào mừng ngay sau khi đăng ký
    let pushTestResult = null;
    if (body.sendWelcomePush && !fcmToken.startsWith("fcm-browser-local-")) {
      pushTestResult = await sendMobilePushNotification({
        tokens: [fcmToken],
        title: "GenUp đã kết nối thông báo!",
        body: `Thiết bị ${deviceName} (${platform}) đã sẵn sàng nhận thông báo học tập hàng ngày.`,
        actionUrl: "/notifications",
      }).catch(() => null);
    }

    return NextResponse.json({
      ok: true,
      device: record,
      pushTestResult,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Lỗi đăng ký thiết bị FCM.",
      },
      { status: 500 }
    );
  }
}
