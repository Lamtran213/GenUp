"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Plus, Trash2 } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { ParentInboxMessage } from "@/lib/types";

export default function ParentInboxPage() {
  const {
    parentInbox,
    generateSampleEmail,
    markInboxRead,
    deleteInboxMessage,
  } = useGenUp();
  const [notice, setNotice] = useState<string | null>(null);

  const handleGenerate = async (category: ParentInboxMessage["category"]) => {
    const res = await generateSampleEmail(category);
    setNotice(res.message);
  };

  const unreadCount = parentInbox.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Hộp thư Phụ huynh & Mẫu Email học tập (US-37, US-38)
          </h1>
          <p className="text-xs text-muted">
            Lưu trữ trong MongoDB ({unreadCount} thư chưa đọc). Các thư mẫu được đánh dấu mô phỏng và tuân thủ ẩn dữ liệu nhạy cảm.
          </p>
        </div>

        <Link
          href="/parent/email-settings"
          className="h-9 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
        >
          Tùy chỉnh Cài đặt Email
        </Link>
      </div>

      {/* Tạo 4 loại email mẫu (US-37 AC1) */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2.5">
        <p className="text-xs font-semibold text-muted">
          Tạo nhanh 4 mẫu thông báo email nội bộ (US-37):
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "progress_report", label: "1. Báo cáo tiến độ định kỳ" },
              { id: "study_reminder", label: "2. Lời nhắc học tập" },
              { id: "new_content", label: "3. Thông báo bài học mới" },
              { id: "premium_offer", label: "4. Cập nhật gói Premium" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => handleGenerate(btn.id)}
              className="h-9 px-3 rounded-xl bg-background hover:bg-secondary text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
        {notice && <p className="text-xs text-amber-800 pt-1">{notice}</p>}
      </div>

      {/* Danh sách thư */}
      {parentInbox.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-10 text-center space-y-2">
          <Mail className="w-6 h-6 text-muted mx-auto" />
          <p className="text-sm font-semibold">Hộp thư hiện đang trống</p>
          <p className="text-xs text-muted">
            Hãy nhấn một trong các nút ở trên để tạo mẫu thông báo học tập.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">
          {parentInbox.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 ${
                msg.isRead ? "opacity-80" : "bg-surface"
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                      Chưa đọc
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-background text-muted text-[11px] font-medium">
                    Thư mô phỏng nội bộ
                  </span>
                  <Link
                    href={`/parent/inbox/${msg.id}`}
                    onClick={() => markInboxRead(msg.id)}
                    className="text-sm font-semibold hover:underline truncate"
                  >
                    {msg.subject}
                  </Link>
                </div>
                <p className="text-xs text-muted line-clamp-2">{msg.previewText}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!msg.isRead && (
                  <button
                    type="button"
                    onClick={() => markInboxRead(msg.id)}
                    className="h-8 px-2.5 rounded-lg border border-border-strong text-xs font-medium hover:bg-button-hover"
                  >
                    Đã đọc
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteInboxMessage(msg.id)}
                  className="h-8 px-2.5 rounded-lg text-danger bg-danger-bg hover:bg-danger-bg-hover text-xs font-medium inline-flex items-center gap-1"
                  title="Xóa thư"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

