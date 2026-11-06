"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Compass, Flame, TrendingUp } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { TopicCategory } from "@/lib/types";

const TOPICS: TopicCategory[] = ["Puberty", "Boundaries", "CyberSafety", "Emotion"];

export default function ProgressPage() {
  const { profile, modules, scenarios, lessonProgress, scenarioAttempts } = useGenUp();

  const completedLessonsCount = Object.values(lessonProgress).filter(
    (p) => p.status === "Completed"
  ).length;
  const resolvedScenariosCount = Object.keys(scenarioAttempts).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Tiến độ học tập & Chuỗi ngày học (US-20, US-25)
        </h1>
        <p className="text-xs text-muted">
          Theo dõi các bài học, tình huống đã hoàn thành và cột mốc thưởng Learning Streak 3, 7, 14 ngày.
        </p>
      </div>

      {/* 4 Thẻ tổng hợp */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Bài đã hoàn thành</span>
            <BookOpen className="w-4 h-4 text-muted" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {completedLessonsCount} / {modules.length}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Tình huống vượt qua</span>
            <Compass className="w-4 h-4 text-muted" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {resolvedScenariosCount} / {scenarios.length}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Tổng điểm XP</span>
            <TrendingUp className="w-4 h-4 text-muted" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{profile.totalXp} XP</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Streak hiện tại / Kỷ lục</span>
            <Flame className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {profile.currentStreak} / {profile.longestStreak} ngày
          </p>
        </div>
      </div>

      {/* Cột mốc thưởng Learning Streak 3 / 7 / 14 ngày (US-26) */}
      <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              Cột mốc thưởng Learning Streak (US-26)
            </h2>
            <p className="text-xs text-muted">
              Mỗi cột mốc chỉ trao thưởng một lần duy nhất khi bạn duy trì chuỗi ngày học hợp lệ liên tiếp.
            </p>
          </div>
          <span className="text-xs font-medium tabular-nums">
            Chuỗi hiện tại: {profile.currentStreak} ngày
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { days: 3, points: 30, label: "Mốc Khởi Động (3 ngày)" },
            { days: 7, points: 70, label: "Mốc Bền Bỉ (7 ngày)" },
            { days: 14, points: 140, label: "Mốc Thói Quen Vàng (14 ngày)" },
          ].map((milestone) => {
            const claimed = profile.claimedStreakMilestones.includes(milestone.days);
            return (
              <div
                key={milestone.days}
                className="p-4 rounded-xl bg-background border border-border-strong flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">{milestone.label}</p>
                  <p className="text-xs text-muted tabular-nums">
                    Thưởng: +{milestone.points} Reward Points
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${
                    claimed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {claimed ? "Đã nhận" : "Chưa đạt"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tiến độ theo từng chủ đề */}
      <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold">Tiến độ theo chủ đề giáo dục</h2>
        <div className="space-y-3">
          {TOPICS.map((topic) => {
            const topicMods = modules.filter((m) => m.topicCategory === topic);
            const doneCount = topicMods.filter(
              (m) => lessonProgress[m.id]?.status === "Completed"
            ).length;
            const pct =
              topicMods.length > 0
                ? Math.round((doneCount / topicMods.length) * 100)
                : 0;

            return (
              <div key={topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{TOPIC_LABELS[topic]}</span>
                  <span className="text-muted tabular-nums">
                    {doneCount}/{topicMods.length} bài ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted">
            Trạng thái tự động lưu LocalStorage & đồng bộ Cloud (US-22, US-47)
          </span>
          <Link href="/lessons" className="font-medium text-foreground hover:underline inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Học thêm bài mới</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

