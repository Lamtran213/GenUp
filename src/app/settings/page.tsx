"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { TopicCategory } from "@/lib/types";

const ALL_TOPICS: TopicCategory[] = ["Puberty", "Emotion", "Boundaries", "CyberSafety"];

export default function SettingsPage() {
  const {
    profile,
    parentSettings,
    updateProfile,
    updateParentSettings,
  } = useGenUp();

  const [nickname, setNickname] = useState(profile.nickname);
  const [grade, setGrade] = useState<6 | 7 | 8 | 9>(profile.grade);
  const [topics, setTopics] = useState<TopicCategory[]>(profile.interestedTopics);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const toggleTopic = (t: TopicCategory) => {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // US-04 AC3: Không cho phép lưu biệt danh rỗng
    if (!nickname.trim()) {
      setStatusMessage({
        type: "error",
        text: "Biệt danh không được để trống. Dữ liệu hợp lệ trước đó vẫn được giữ nguyên.",
      });
      return;
    }

    const ok = updateProfile({
      nickname: nickname.trim(),
      grade,
      interestedTopics: topics,
    });

    if (ok) {
      setStatusMessage({
        type: "success",
        text: "Đã cập nhật hồ sơ học sinh thành công mà không làm thay đổi tiến độ học tập (US-04).",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Cài đặt Hồ sơ & Quyền chia sẻ Gia đình (US-04, US-46)
        </h1>
        <p className="text-xs text-muted">
          Chỉnh sửa biệt danh, lớp học, chủ đề quan tâm và quản lý trạng thái liên kết Góc Phụ Huynh.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-error-bg border-error-border text-error-text"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Biểu mẫu chỉnh sửa hồ sơ học sinh (US-04) */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-surface border border-border rounded-xl p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold">Thông tin hồ sơ học sinh</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium block">Biệt danh *</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface border border-border-strong text-sm focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium block">Khối lớp</label>
          <div className="grid grid-cols-4 gap-2">
            {([6, 7, 8, 9] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`h-10 rounded-xl border text-xs font-medium ${
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
          <label className="text-xs font-medium block">Chủ đề quan tâm</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_TOPICS.map((topic) => {
              const active = topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`h-10 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between ${
                    active
                      ? "bg-secondary text-foreground border-border-strong"
                      : "bg-surface text-muted border-border-strong hover:bg-button-hover"
                  }`}
                >
                  <span>{TOPIC_LABELS[topic]}</span>
                  {active && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium"
          >
            Lưu thay đổi hồ sơ
          </button>
        </div>
      </form>

      {/* Cài đặt chia sẻ tóm tắt với Góc Phụ Huynh (US-35 AC3, US-46) */}
      <section className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold">
          Liên kết & Chia sẻ tổng hợp với Phụ huynh (US-35, NFR-S06)
        </h2>

        <div className="flex items-center justify-between gap-4 py-2 border-b border-border">
          <div>
            <p className="text-xs font-medium">Liên kết hồ sơ gia đình</p>
            <p className="text-xs text-muted">
              Cho phép tài khoản phụ huynh xem tiến độ tổng quan tại /parent
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updateParentSettings({ parentLinked: !parentSettings.parentLinked })
            }
            className={`h-8 px-3 rounded-lg text-xs font-medium ${
              parentSettings.parentLinked
                ? "bg-emerald-50 text-emerald-700"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {parentSettings.parentLinked ? "Đang liên kết" : "Đã ngắt liên kết"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <p className="text-xs font-medium">Chia sẻ báo cáo tổng hợp</p>
            <p className="text-xs text-muted">
              Chỉ chia sẻ số bài đã học & Streak; ẩn hoàn toàn đáp án tình huống và tin nhắn Gendio
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updateParentSettings({
                parentSummaryEnabled: !parentSettings.parentSummaryEnabled,
              })
            }
            className={`h-8 px-3 rounded-lg text-xs font-medium ${
              parentSettings.parentSummaryEnabled
                ? "bg-emerald-50 text-emerald-700"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {parentSettings.parentSummaryEnabled ? "Đang bật" : "Đang tắt"}
          </button>
        </div>
      </section>
    </div>
  );
}

