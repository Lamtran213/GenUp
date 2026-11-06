"use client";

import React, { useEffect, useState } from "react";
import { Lock, Send, ShieldAlert } from "lucide-react";
import { GendioChatMessage } from "@/lib/types";

const STUDENT_SUGGESTIONS = [
  "Tại sao tuổi dậy thì mình dễ nổi mụn và thay đổi tâm trạng?",
  "Mình nên làm gì khi ai đó chạm vào người khiến mình khó chịu?",
  "Có người lạ trong game hứa tặng quà và xin ảnh riêng tư của mình?",
  "Làm sao để từ chối lời trêu chọc của bạn bè mà không mất lòng?",
];

export default function StudentChatPage() {
  const [messages, setMessages] = useState<GendioChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/gendio?role=student")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => null);
  }, []);

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    // US-40 AC3: Chặn gửi tin nhắn rỗng hoặc toàn khoảng trắng
    if (!clean) {
      setError("Vui lòng nhập nội dung câu hỏi trước khi gửi.");
      return;
    }

    setError(null);
    setSending(true);
    setInput("");

    const res = await fetch("/api/gendio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorRole: "student", text: clean }),
    }).catch(() => null);

    setSending(false);
    if (res && res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.userMessage, data.botMessage]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Hỏi đáp cùng trợ lý Gendio (US-40)
          </h1>
          <p className="text-xs text-muted">
            Giải đáp kiến thức tuổi dậy thì, cảm xúc và kỹ năng an toàn theo bộ phản hồi đã kiểm duyệt.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
          <Lock className="w-3.5 h-3.5" />
          Bảo mật riêng tư (Ẩn khỏi báo cáo Phụ huynh - NFR-S06)
        </span>
      </div>

      {/* Câu hỏi gợi ý (US-40 AC1) */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2.5">
        <p className="text-xs font-semibold text-muted">
          Chọn nhanh câu hỏi gợi ý:
        </p>
        <div className="flex flex-wrap gap-2">
          {STUDENT_SUGGESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-background hover:bg-secondary text-xs text-left transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Khung hội thoại */}
      <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : msg.requiresAdultSupport
                      ? "bg-error-bg border border-error-border text-error-strong"
                      : "bg-background text-foreground border border-border-strong"
                  }`}
                >
                  {msg.requiresAdultSupport && (
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Hướng dẫn bảo vệ khẩn cấp (US-50 AC2)</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="text-xs text-error-text">{error}</p>}

        {/* Ô nhập tin nhắn */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 pt-2 border-t border-border"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Nhập câu hỏi của bạn về dậy thì, cảm xúc hoặc an toàn..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-surface border border-border-strong text-xs focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
          />
          <button
            type="submit"
            disabled={sending}
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

