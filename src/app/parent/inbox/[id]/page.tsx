"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";

export default function ParentInboxDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { parentInbox, markInboxRead, deleteInboxMessage } = useGenUp();

  const msgId = params?.id || "";
  const msg = parentInbox.find((m) => m.id === msgId);

  useEffect(() => {
    if (msg && !msg.isRead) {
      markInboxRead(msg.id);
    }
  }, [msg, markInboxRead]);

  // US-38 AC3: Xem email đã bị xóa hoặc không tồn tại
  if (!msg) {
    return (
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-error-text mx-auto" />
        <h1 className="text-base font-semibold">Không tìm thấy thư thông báo</h1>
        <p className="text-xs text-muted">
          Thư này đã bị xóa hoặc đường dẫn không tồn tại (US-38 AC3).
        </p>
        <Link
          href="/parent/inbox"
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Hộp thư Phụ huynh</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/parent/inbox"
          className="text-xs font-medium text-muted hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Hộp thư Phụ huynh</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            deleteInboxMessage(msg.id);
            router.push("/parent/inbox");
          }}
          className="h-8 px-3 rounded-lg text-danger bg-danger-bg hover:bg-danger-bg-hover text-xs font-medium inline-flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa thư này</span>
        </button>
      </div>

      <article className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-1.5 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-background text-xs font-medium">
              Chu kỳ {msg.periodDays} ngày
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
              Đã đọc
            </span>
          </div>
          <h1 className="text-lg font-semibold">{msg.subject}</h1>
        </div>

        <p className="text-sm text-foreground leading-relaxed">{msg.bodyText}</p>

        {msg.conversationPrompts.length > 0 && (
          <div className="p-4 rounded-xl bg-background border border-border-strong space-y-2">
            <p className="text-xs font-semibold">
              Gợi ý câu hỏi đồng hành cùng con tuần này:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-muted">
              {msg.conversationPrompts.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}

