"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Send, Smartphone, Terminal } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import {
  registerFirebasePushToken,
  showBrowserNotification,
} from "@/lib/firebase/client";

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useGenUp();
  const [fcmStatus, setFcmStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [sendingTest, setSendingTest] = useState(false);
  const [showMobileSpec, setShowMobileSpec] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("genup_fcm_device_token");
      if (saved) setCurrentToken(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleEnableMobilePush = async () => {
    setFcmStatus("Đang yêu cầu quyền thông báo & đăng ký Service Worker...");
    setIsError(false);

    const res = await registerFirebasePushToken();
    if (res.ok && res.token) {
      setCurrentToken(res.token);
      setIsError(false);
      setFcmStatus(res.message);
    } else {
      setIsError(true);
      setFcmStatus(res.message);
    }
  };

  const handleSendTestPush = async () => {
    setSendingTest(true);
    const title = "Nhắc nhở chuỗi Streak từ GenUp!";
    const body =
      "Chỉ cần 5 phút hoàn thành 1 bài học hoặc 1 tình huống hôm nay để giữ vững chuỗi Streak của bạn nhé!";

    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "streak",
        title,
        body,
        actionUrl: "/lessons",
        fcmTokens: currentToken ? [currentToken] : [],
      }),
    }).catch(() => null);

    await showBrowserNotification(title, body);
    setSendingTest(false);

    if (res && res.ok) {
      setIsError(false);
      setFcmStatus(
        "Đã bắn thử Push Notification thành công (Hiển thị popup trên máy + lưu vào MongoDB & gửi qua Firebase Admin FCM)!"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Thông báo trong ứng dụng & Firebase Push (US-42)
          </h1>
          <p className="text-xs text-muted">
            Cập nhật huy hiệu mới, mốc thưởng Learning Streak và lời nhắc học tập hàng ngày.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleEnableMobilePush}
            className="h-9 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>
              {currentToken ? "Đã kết nối FCM (Làm mới)" : "Kết nối Firebase FCM"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSendTestPush}
            disabled={sendingTest}
            className="h-9 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sendingTest ? "Đang gửi..." : "Bắn thử Push Notification"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMobileSpec((prev) => !prev)}
            className="h-9 px-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API cho Mobile App</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markNotificationRead(undefined, true)}
              className="h-9 px-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Đánh dấu tất cả đã đọc ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {fcmStatus && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed ${
            isError
              ? "bg-error-bg border-error-border text-error-text"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {fcmStatus}
        </div>
      )}

      {/* Tài liệu tích hợp nhanh cho Mobile App (Android / iOS / React Native / Flutter) */}
      {showMobileSpec && (
        <div className="bg-surface border border-border-strong rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Cổng API Firebase Cloud Messaging (FCM) cho Mobile App (Android / iOS)
            </h2>
            <span className="text-xs text-muted">Project ID: genup-9c6c3</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Backend Next.js trên Vercel đã tích hợp sẵn Firebase Admin SDK (`firebase-admin`)
            và mở sẵn 2 API để ứng dụng Mobile (React Native / Flutter / Kotlin / Swift) gọi trực tiếp:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-background border border-border space-y-1.5">
              <p className="font-semibold text-foreground">
                1. Đăng ký Token từ máy Mobile: `POST /api/fcm/device`
              </p>
              <pre className="text-[11px] text-muted overflow-x-auto whitespace-pre-wrap font-mono">
{`{
  "fcmToken": "<token_tu_FirebaseMessaging_mobile>",
  "platform": "android", // hoặc "ios"
  "firebaseUid": "<uid_nguoi_dung>",
  "deviceName": "Samsung S24 / iPhone 15",
  "sendWelcomePush": true
}`}
              </pre>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border space-y-1.5">
              <p className="font-semibold text-foreground">
                2. Bắn Push Notification xuống Mobile: `POST /api/notifications`
              </p>
              <pre className="text-[11px] text-muted overflow-x-auto whitespace-pre-wrap font-mono">
{`{
  "type": "streak",
  "title": "Nhắc học tập GenUp",
  "body": "Hoàn thành 1 bài học để giữ Streak!",
  "actionUrl": "/lessons",
  "fcmTokens": ["<fcmToken_mobile>"]
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl divide-y divide-border">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 flex items-start justify-between gap-4 ${
              item.isRead ? "opacity-75" : "bg-surface"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-foreground" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{item.title}</p>
                  {!item.isRead && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                      Mới
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed">{item.body}</p>
                <div className="pt-1 flex items-center gap-3 text-xs">
                  <Link
                    href={item.actionUrl}
                    onClick={() => markNotificationRead(item.id)}
                    className="font-medium text-foreground hover:underline"
                  >
                    Xem chi tiết →
                  </Link>
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(item.id)}
                      className="text-muted hover:text-foreground"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
