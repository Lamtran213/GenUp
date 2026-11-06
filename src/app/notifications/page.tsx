"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Smartphone } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { registerFirebasePushToken } from "@/lib/firebase/client";

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useGenUp();
  const [fcmStatus, setFcmStatus] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleEnableMobilePush = async () => {
    const token = await registerFirebasePushToken();
    if (token) {
      setFcmStatus(
        `Đã kết nối Firebase Cloud Messaging (Token: ${token.slice(0, 18)}...)`
      );
    } else {
      setFcmStatus("Trình duyệt hiện tại chưa bật quyền Push Notification.");
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEnableMobilePush}
            className="h-9 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Kết nối Firebase FCM Mobile</span>
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
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          {fcmStatus}
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

