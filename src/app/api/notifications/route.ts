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
  if (db) {
    await db.collection<InAppNotification>("in_app_notifications").insertOne(item);
  } else {
    const store = getFallbackStore();
    store.notifications.unshift(item);
  }

  // Đẩy Push Notification qua Firebase Cloud Messaging (FCM) xuống Mobile/Web
  const fcmResult = await sendMobilePushNotification({
    tokens: fcmTokens,
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

