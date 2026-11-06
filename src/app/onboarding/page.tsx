"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { TopicCategory } from "@/lib/types";
import { useGenUp } from "@/context/GenUpContext";

const ALL_TOPICS: TopicCategory[] = ["Puberty", "Emotion", "Boundaries", "CyberSafety"];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useGenUp();

  const [nickname, setNickname] = useState(profile.nickname);
  const [grade, setGrade] = useState<6 | 7 | 8 | 9>(profile.grade);
  const [topics, setTopics] = useState<TopicCategory[]>(profile.interestedTopics);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (topic: TopicCategory) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // US-01 AC3 & US-03 AC3: Chặn biệt danh rỗng hoặc toàn khoảng trắng
    if (!nickname.trim()) {
      setError("Biệt danh không được để trống hoặc chỉ chứa khoảng trắng.");
      return;
    }

    const ok = updateProfile({
      nickname: nickname.trim(),
      grade,
      interestedTopics: topics, // US-03 AC2: Chấp nhận cả khi người học bỏ trống chủ đề
    });

    if (!ok) {
      setError("Thông tin hồ sơ chưa hợp lệ.");
      return;
    }

    router.push("/choose-avatar");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted">Bước 1 / 2 · Khởi tạo hồ sơ (US-01, US-03)</span>
          <h1 className="text-xl font-semibold tracking-tight">
            Làm quen và tạo hồ sơ học tập của bạn
          </h1>
          <p className="text-xs text-muted">
            Sử dụng biệt danh yêu thích (không cần nhập tên thật hay số điện thoại cá nhân).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Biệt danh của bạn *
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ví dụ: Minh Anh, Sóc Nhỏ..."
              className="w-full h-10 px-3 rounded-xl bg-surface border border-border-strong text-sm focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
            />
            {error && <p className="text-xs text-error-text">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Khối lớp hiện tại (THCS)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([6, 7, 8, 9] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                    grade === g
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-foreground border-border-strong hover:bg-button-hover"
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Chủ đề bạn đang quan tâm (Tùy chọn)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_TOPICS.map((topic) => {
                const selected = topics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`h-10 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-colors ${
                      selected
                        ? "bg-secondary text-foreground border-border-strong"
                        : "bg-surface text-muted border-border-strong hover:bg-button-hover"
                    }`}
                  >
                    <span>{TOPIC_LABELS[topic]}</span>
                    {selected && <span className="text-foreground font-semibold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
            >
              Hủy & Về Dashboard
            </Link>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium"
            >
              Tiếp tục chọn nhân vật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

