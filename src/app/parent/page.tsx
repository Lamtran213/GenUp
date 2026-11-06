"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Compass,
  Flame,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { TopicCategory } from "@/lib/types";

const TOPICS: TopicCategory[] = ["Puberty", "Boundaries", "CyberSafety", "Emotion"];

export default function ParentDashboardPage() {
  const {
    profile,
    modules,
    lessonProgress,
    scenarioAttempts,
    parentSettings,
    updateParentSettings,
    generateSampleEmail,
  } = useGenUp();

  const [periodDays, setPeriodDays] = useState<7 | 14 | 30>(
    parentSettings.reportFrequencyDays
  );
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  // US-35 AC3: Hồ sơ chưa liên kết hoặc tắt chia sẻ tổng hợp
  if (!parentSettings.parentLinked || !parentSettings.parentSummaryEnabled) {
    return (
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-xl p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
        <div className="space-y-1">
          <h1 className="text-base font-semibold">
            Chưa bật quyền xem báo cáo tổng hợp hồ sơ học sinh (US-35 AC3)
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Hồ sơ học sinh hiện chưa liên kết hoặc tính năng chia sẻ tóm tắt phụ huynh đang tắt.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              updateParentSettings({
                parentLinked: true,
                parentSummaryEnabled: true,
              })
            }
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
          >
            Liên kết & Bật chia sẻ tổng hợp
          </button>
          <Link
            href="/settings"
            className="h-9 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
          >
            Mở Cài đặt
          </Link>
        </div>
      </div>
    );
  }

  const completedLessonsCount = Object.values(lessonProgress).filter(
    (p) => p.status === "Completed"
  ).length;
  const practicedScenariosCount = Object.keys(scenarioAttempts).length;

  const handleCreatePeriodReport = async () => {
    updateParentSettings({ reportFrequencyDays: periodDays });
    const res = await generateSampleEmail("progress_report");
    setReportNotice(res.message);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            Đã liên kết hồ sơ: {profile.nickname} (Lớp {profile.grade})
          </span>
          <h1 className="text-xl font-semibold tracking-tight pt-0.5">
            Bảng điều khiển Phụ huynh & Báo cáo định kỳ (US-35, US-36)
          </h1>
        </div>

        {/* Bộ lọc chu kỳ báo cáo 7 / 14 / 30 ngày (US-36) */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex p-1 rounded-xl bg-surface border border-border-strong"
            style={{ boxShadow: "var(--shadow-segment-track)" }}
          >
            {([7, 14, 30] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setPeriodDays(d)}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${
                  periodDays === d
                    ? "bg-background text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {d} ngày
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCreatePeriodReport}
            className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Tạo báo cáo {periodDays} ngày</span>
          </button>
        </div>
      </div>

      {reportNotice && (
        <div className="p-3.5 rounded-xl bg-surface border border-border-strong text-xs font-medium flex items-center justify-between">
          <span>{reportNotice}</span>
          <Link href="/parent/inbox" className="font-semibold underline">
            Mở Hộp thư →
          </Link>
        </div>
      )}

      {/* Cam kết bảo vệ dữ liệu nhạy cảm của trẻ (NFR-S06, US-35 AC4, US-36 AC4) */}
      <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold">
            Nguyên tắc Bảo vệ Quyền riêng tư Học sinh (NFR-S06)
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Parent Dashboard chỉ hiển thị dữ liệu tiến độ tổng quan. Hệ thống tuyệt đối không công khai phương án trả lời từng tình huống riêng tư hoặc lịch sử chat Gendio của con.
          </p>
        </div>
      </div>

      {/* Chỉ số tổng hợp */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Bài học đã hoàn thành</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {completedLessonsCount} / {modules.length}
          </p>
          <p className="text-xs text-muted">Chu kỳ {periodDays} ngày qua</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Số tình huống đã luyện</span>
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {practicedScenariosCount} tình huống
          </p>
          <p className="text-xs text-muted">Ẩn chi tiết đáp án cá nhân</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Chuỗi ngày học Streak</span>
            <Flame className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {profile.currentStreak} ngày
          </p>
          <p className="text-xs text-muted">Kỷ lục: {profile.longestStreak} ngày</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Gói dịch vụ gia đình</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-lg font-semibold">
            {parentSettings.planType === "Free"
              ? "Free (15 phút/ngày)"
              : "Premium Không giới hạn"}
          </p>
          <Link href="/premium" className="text-xs font-medium underline block">
            Xem so sánh gói →
          </Link>
        </div>
      </div>

      {/* Tiến độ theo chủ đề & Gợi ý mở lời trò chuyện cùng con */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold">
            Mức độ tiếp cận theo chủ đề giáo dục
          </h2>
          <div className="space-y-3">
            {TOPICS.map((topic) => {
              const mods = modules.filter((m) => m.topicCategory === topic);
              const done = mods.filter(
                (m) => lessonProgress[m.id]?.status === "Completed"
              ).length;
              const pct = mods.length > 0 ? Math.round((done / mods.length) * 100) : 0;
              return (
                <div key={topic} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{TOPIC_LABELS[topic]}</span>
                    <span className="text-muted tabular-nums">
                      {done}/{mods.length} bài ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <h2 className="text-sm font-semibold">
              Gợi ý chủ đề trò chuyện cuối tuần cùng con (US-36 AC4)
            </h2>
            <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
              <li>
                &ldquo;Mẹ thấy tuần này con tìm hiểu về sự thay đổi tuổi dậy thì, con có cần mua thêm sản phẩm chăm sóc da hay đồ dùng cá nhân nào không?&rdquo;
              </li>
              <li>
                &ldquo;Nếu có người lạ trên mạng nhắn tin xin thông tin trường lớp, theo con cách xử lý nào là an toàn nhất?&rdquo;
              </li>
              <li>
                &ldquo;Bố mẹ luôn tôn trọng không gian riêng của con và sẵn sàng lắng nghe bất cứ khi nào con gặp chuyện khó xử ở trường.&rdquo;
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <Link
              href="/parent/gendio"
              className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hỏi Gendio Phụ huynh cách đồng hành</span>
            </Link>
            <Link
              href="/parent/email-settings"
              className="text-xs text-muted hover:text-foreground"
            >
              Cài đặt tần suất Email →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

