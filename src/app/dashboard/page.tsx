"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { Avatar2D } from "@/components/avatar/Avatar2D";
import { DAILY_MISSIONS, TOPIC_LABELS } from "@/lib/seed-data";

export default function StudentDashboardPage() {
  const {
    profile,
    modules,
    scenarios,
    lessonProgress,
    scenarioAttempts,
    completedMissionIdsToday,
    getRecommendedNextModule,
  } = useGenUp();

  const completedLessonsCount = Object.values(lessonProgress).filter(
    (p) => p.status === "Completed"
  ).length;
  const resolvedScenariosCount = Object.keys(scenarioAttempts).length;
  const recommendedModule = getRecommendedNextModule();

  return (
    <div className="space-y-6">
      {/* Đầu trang: Chào học sinh & Nhân vật đại diện */}
      <section className="bg-surface border border-border rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar2D
            gender={profile.avatarGender}
            hairId={profile.equippedHairId}
            outfitId={profile.equippedOutfitId}
            accessoryId={profile.equippedAccessoryId}
            size={76}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold tracking-tight">
                Chào {profile.nickname}!
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-background text-foreground text-xs font-medium">
                Lớp {profile.grade}
              </span>
            </div>
            <p className="text-xs text-muted">
              Chủ đề quan tâm:{" "}
              {profile.interestedTopics.length > 0
                ? profile.interestedTopics.map((t) => TOPIC_LABELS[t]).join(" · ")
                : "Tất cả chủ đề kỹ năng THCS"}
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs">
              <Link
                href="/avatar"
                className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Tùy chỉnh Avatar
              </Link>
              <span className="text-muted">·</span>
              <Link href="/settings" className="text-muted hover:text-foreground">
                Sửa hồ sơ
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/lessons"
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
          >
            <span>Mở Thư viện bài học</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Hàng 4 thẻ chỉ số chính (US-19, US-20) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted">Bài học hoàn thành</p>
            <p className="text-2xl font-semibold tabular-nums">
              {completedLessonsCount} / {modules.length}
            </p>
            <p className="text-xs text-muted">+50 XP lần đầu</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-foreground" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted">Tình huống đã giải</p>
            <p className="text-2xl font-semibold tabular-nums">
              {resolvedScenariosCount} / {scenarios.length}
            </p>
            <p className="text-xs text-muted">+30 XP lần đầu</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
            <Compass className="w-4 h-4 text-foreground" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted">Điểm kinh nghiệm & Ví</p>
            <p className="text-2xl font-semibold tabular-nums">{profile.totalXp} XP</p>
            <p className="text-xs text-muted tabular-nums">
              {profile.rewardPoints} Reward Points
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
            <Award className="w-4 h-4 text-foreground" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted">Chuỗi Learning Streak</p>
            <p className="text-2xl font-semibold tabular-nums">
              {profile.currentStreak} ngày
            </p>
            <p className="text-xs text-muted tabular-nums">
              Kỷ lục: {profile.longestStreak} ngày
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-700" />
          </div>
        </div>
      </section>

      {/* Khối Tiếp tục bài học đang dở / Gợi ý bài tiếp theo (US-17, US-18) & Nhiệm vụ hằng ngày (US-24) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">
                {recommendedModule &&
                lessonProgress[recommendedModule.id]?.status === "InProgress"
                  ? "Tiếp tục bài học đang dở (US-17)"
                  : "Gợi ý bài học tiếp theo (US-18)"}
              </span>
              {recommendedModule && (
                <span className="px-2 py-0.5 rounded-md bg-background text-foreground text-xs font-medium">
                  {TOPIC_LABELS[recommendedModule.topicCategory]}
                </span>
              )}
            </div>

            {recommendedModule ? (
              <>
                <h2 className="text-base font-semibold">{recommendedModule.title}</h2>
                <p className="text-xs text-muted leading-relaxed">
                  {recommendedModule.summary}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold">
                  Bạn đã hoàn thành toàn bộ bài học trong thư viện!
                </h2>
                <p className="text-xs text-muted">
                  Hãy chọn một bài bất kỳ trong thư viện để ôn tập và nhận điểm nhiệm vụ hàng ngày.
                </p>
              </>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border">
            {recommendedModule ? (
              <>
                <span className="text-xs text-muted tabular-nums">
                  Đang ở bước{" "}
                  {(lessonProgress[recommendedModule.id]?.currentStepIndex ?? 0) + 1} /{" "}
                  {recommendedModule.steps.length} · Thưởng +{recommendedModule.xpReward} XP
                </span>
                <Link
                  href={`/lessons/${recommendedModule.id}`}
                  className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>
                    {lessonProgress[recommendedModule.id]?.status === "InProgress"
                      ? "Học tiếp ngay"
                      : "Bắt đầu bài học"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <Link
                href="/lessons"
                className="h-9 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
              >
                <span>Ôn tập Thư viện bài học</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Nhiệm vụ hằng ngày (US-24) */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Nhiệm vụ hôm nay</h2>
            <span className="text-xs text-muted tabular-nums">
              {completedMissionIdsToday.length}/{DAILY_MISSIONS.length} hoàn thành
            </span>
          </div>

          <div className="space-y-2">
            {DAILY_MISSIONS.map((mission) => {
              const done = completedMissionIdsToday.includes(mission.id);
              return (
                <div
                  key={mission.id}
                  className="p-2.5 rounded-xl bg-background flex items-start justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        done ? "text-emerald-700" : "text-muted"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium ${
                          done ? "line-through text-muted" : "text-foreground"
                        }`}
                      >
                        {mission.title}
                      </p>
                      <p className="text-[11px] text-muted tabular-nums">
                        +{mission.xpReward} XP · +{mission.rewardPoints} Điểm
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 ${
                      done
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {done ? "Đã nhận" : "Chưa đạt"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lối tắt sang Thực hành tình huống & Hỏi Gendio */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/scenarios"
          className="bg-surface border border-border hover:border-border-strong rounded-xl p-4 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
              <Compass className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Luyện tập tình huống độc lập</p>
              <p className="text-xs text-muted">
                Thực hành kỹ năng từ chối, xử lý tin nhắn lạ và ứng xử văn minh
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted shrink-0" />
        </Link>

        <Link
          href="/chat"
          className="bg-surface border border-border hover:border-border-strong rounded-xl p-4 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Trò chuyện kín đáo với Gendio</p>
              <p className="text-xs text-muted">
                Giải đáp thắc mắc tuổi dậy thì (Bảo mật riêng tư, không lộ trên báo cáo)
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted shrink-0" />
        </Link>
      </section>
    </div>
  );
}

