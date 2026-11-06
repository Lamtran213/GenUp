import { NextRequest, NextResponse } from "next/server";
import { getFallbackStore, getMongoDatabase } from "@/lib/mongodb/client";
import { sendMobilePushNotification } from "@/lib/firebase/admin";
import { InAppNotification } from "@/lib/types";

export async function GET() {
  const db = await getMongoDatabase();
  if (db) {
    const items = await db
      .collection<InAppNotification>("in_app_notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();
    return NextResponse.json({ notifications: items, storage: "mongodb" });
  }

  const store = getFallbackStore();
  return NextResponse.json({
    notifications: store.notifications,
    storage: "memory-fallback",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "Thông báo mới từ GenUp");
  const text = String(body.body || "Bạn vừa đạt một cột mốc học tập mới!");
  const actionUrl = String(body.actionUrl || "/rewards");
  const fcmTokens: string[] = Array.isArray(body.fcmTokens) ? body.fcmTokens : [];

  const item: InAppNotification = {
    id: `notif-${Date.now()}`,
    type: body.type || "system",
    title,
    body: text,
    actionUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const db = await getMongoDatabase();
  const targetTokens = new Set<string>(
    fcmTokens.filter((t) => typeof t === "string" && !t.startsWith("fcm-browser-local-"))
  );

  if (db) {
    await db.collection<InAppNotification>("in_app_notifications").insertOne(item);
    // Tự động lấy thêm toàn bộ token thiết bị Mobile (Android / iOS) & Web đã đăng ký trong fcm_devices
    const savedDevices = await db
      .collection<{ fcmToken?: string }>("fcm_devices")
      .find({})
      .limit(50)
      .toArray();
    for (const dev of savedDevices) {
      if (dev.fcmToken && !dev.fcmToken.startsWith("fcm-browser-local-")) {
        targetTokens.add(dev.fcmToken);
      }
    }
  } else {
    const store = getFallbackStore();
    store.notifications.unshift(item);
  }

  // Đẩy Push Notification qua Firebase Cloud Messaging (FCM) xuống Mobile/Web
  const fcmResult = await sendMobilePushNotification({
    tokens: Array.from(targetTokens),
    title,
    body: text,
    actionUrl,
  });

  return NextResponse.json({ notification: item, fcmResult });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const markAll = Boolean(body.markAll);
  const id = String(body.id || "");

  const db = await getMongoDatabase();
  if (db) {
    if (markAll) {
      await db
        .collection<InAppNotification>("in_app_notifications")
        .updateMany({}, { $set: { isRead: true } });
    } else if (id) {
      await db
        .collection<InAppNotification>("in_app_notifications")
        .updateOne({ id }, { $set: { isRead: true } });
    }
  } else {
    const store = getFallbackStore();
    store.notifications.forEach((n) => {
      if (markAll || n.id === id) {
        n.isRead = true;
      }
    });
  }

  return NextResponse.json({ ok: true });
}

