"use client";

import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { GendioChatMessage } from "@/lib/types";

const PARENT_FAQ_PROMPTS = [
  "Tại sao phụ huynh không xem được câu trả lời tình huống và tin nhắn chat của con?",
  "Bộ đếm 15 phút học miễn phí mỗi ngày hoạt động như thế nào?",
  "Làm sao để mở lời nói chuyện với con lớp 7 về tuổi dậy thì tự nhiên nhất?",
  "Sự khác biệt giữa gói Free và gói Premium 500.000đ/năm là gì?",
];

export default function ParentGendioPage() {
  const [messages, setMessages] = useState<GendioChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gendio?role=parent")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => null);
  }, []);

  const handleSend = async (text: string) => {
    const clean = text.trim();
    if (!clean) {
      setError("Vui lòng nhập câu hỏi trước khi gửi.");
      return;
    }
    setError(null);
    setInput("");

    const res = await fetch("/api/gendio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorRole: "parent", text: clean }),
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.userMessage, data.botMessage]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Trợ lý Gendio dành cho Phụ huynh (UC-22)
        </h1>
        <p className="text-xs text-muted">
          Giải đáp câu hỏi thường gặp về cách sử dụng GenUp, chính sách quyền riêng tư và gợi ý đồng hành cùng con.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-muted">Câu hỏi thường gặp của Phụ huynh:</p>
        <div className="flex flex-wrap gap-2">
          {PARENT_FAQ_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-background hover:bg-secondary text-xs text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="space-y-3 max-h-[360px] overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground border border-border-strong"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-error-text">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
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
            placeholder="Nhập câu hỏi dành cho Gendio Phụ huynh..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-surface border border-border-strong text-xs focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

