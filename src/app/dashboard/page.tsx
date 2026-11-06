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
  Gem,
  MessageCircle,
  Sparkles,
  Trophy,
  Zap,
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

  const currentLevel = Math.floor(profile.totalXp / 100) + 1;
  const xpInLevel = profile.totalXp % 100;

  return (
    <div className="space-y-6">
      {/* Đầu trang: Thẻ Nhân vật & Cấp độ (Player Hero Card) */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-2xl bg-white/95 shadow-md border-2 border-emerald-300 shrink-0">
            <Avatar2D
              gender={profile.avatarGender}
              hairId={profile.equippedHairId}
              outfitId={profile.equippedOutfitId}
              accessoryId={profile.equippedAccessoryId}
              size={76}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold">
                CẤP ĐỘ {currentLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                Lớp {profile.grade}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Chào nhà thám hiểm {profile.nickname}!
            </h1>
            <p className="text-xs text-white/90">
              Chủ đề yêu thích:{" "}
              {profile.interestedTopics.length > 0
                ? profile.interestedTopics.map((t) => TOPIC_LABELS[t]).join(" · ")
                : "Tất cả chủ đề kỹ năng THCS"}
            </p>

            {/* Thanh tiến trình Level ngay trên Banner */}
            <div className="pt-1 max-w-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-100">
                <span>Kinh nghiệm cấp {currentLevel}</span>
                <span>{xpInLevel} / 100 XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(10, xpInLevel)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/avatar"
            className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Đổi trang phục 2D</span>
          </Link>
          <Link
            href="/lessons"
            className="h-10 px-4 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm flex-1 md:flex-initial"
          >
            <span>Vào Bản đồ Bài học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Hàng 4 thẻ chỉ số Gamification Liquid Glass rực rỡ (US-19, US-20) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="liquid-glass border-2 border-white/85 rounded-2xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">Bài học hoàn thành</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {completedLessonsCount} / {modules.length}
            </p>
            <p className="text-[11px] font-semibold text-emerald-700">+50 XP mỗi bài</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border-2 border-white/85 rounded-2xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-rose-800">Tình huống đã giải</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {resolvedScenariosCount} / {scenarios.length}
            </p>
            <p className="text-[11px] font-semibold text-rose-700">+30 XP mỗi thử thách</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border-2 border-white/85 rounded-2xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-sky-800">Kho báu XP & Điểm</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {profile.totalXp} XP
            </p>
            <p className="text-[11px] font-semibold text-sky-700 tabular-nums inline-flex items-center gap-1">
              <Gem className="w-3 h-3" /> {profile.rewardPoints} Điểm đổi đồ
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border-2 border-white/85 rounded-2xl p-4 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-900">Chuỗi Learning Streak</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {profile.currentStreak} ngày
            </p>
            <p className="text-[11px] font-semibold text-amber-700 tabular-nums">
              Kỷ lục: {profile.longestStreak} ngày 🔥
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
        </div>
      </section>

      {/* Khối Nhiệm vụ Bài học Tiếp theo (US-17, US-18) & Nhiệm vụ Hằng ngày (US-24) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 liquid-glass border-2 border-white/85 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                {recommendedModule &&
                lessonProgress[recommendedModule.id]?.status === "InProgress"
                  ? "Chặng học đang đi dở (US-17)"
                  : "Chặng học gợi ý tiếp theo (US-18)"}
              </span>
              {recommendedModule && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {TOPIC_LABELS[recommendedModule.topicCategory]}
                </span>
              )}
            </div>

            {recommendedModule ? (
              <>
                <h2 className="text-lg font-bold text-slate-900">
                  {recommendedModule.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {recommendedModule.summary}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-900">
                  Chúc mừng! Bạn đã chinh phục toàn bộ bài học trong thư viện!
                </h2>
                <p className="text-xs text-slate-600">
                  Hãy chọn một bài bất kỳ để ôn tập và hoàn thành nhiệm vụ hàng ngày.
                </p>
              </>
            )}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            {recommendedModule ? (
              <>
                <div className="space-y-1 flex-1 min-w-[180px]">
                  <span className="text-xs font-semibold text-slate-600 tabular-nums block">
                    Bước học:{" "}
                    {(lessonProgress[recommendedModule.id]?.currentStepIndex ?? 0) + 1} /{" "}
                    {recommendedModule.steps.length} · Thưởng +{recommendedModule.xpReward} XP
                  </span>
                  <div className="w-full max-w-xs h-2 rounded-full bg-emerald-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.round(
                          (((lessonProgress[recommendedModule.id]?.currentStepIndex ?? 0) +
                            1) /
                            Math.max(1, recommendedModule.steps.length)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <Link
                  href={`/lessons/${recommendedModule.id}`}
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>
                    {lessonProgress[recommendedModule.id]?.status === "InProgress"
                      ? "Tiếp tục Chặng học"
                      : "Bắt đầu Chinh phục"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                href="/lessons"
                className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Ôn tập Thư viện bài học</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Bảng Nhiệm vụ hằng ngày (Daily Quests - US-24) */}
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Nhiệm vụ Hôm nay</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tabular-nums">
              {completedMissionIdsToday.length}/{DAILY_MISSIONS.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {DAILY_MISSIONS.map((mission) => {
              const done = completedMissionIdsToday.includes(mission.id);
              return (
                <div
                  key={mission.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 ${
                    done
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-amber-50/40 border-amber-200/80"
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        done ? "text-emerald-600" : "text-amber-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold ${
                          done ? "line-through text-slate-500" : "text-slate-900"
                        }`}
                      >
                        {mission.title}
                      </p>
                      <p className="text-[11px] font-bold text-amber-700 tabular-nums mt-0.5">
                        +{mission.xpReward} XP · +{mission.rewardPoints} Điểm
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      done
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-200/80 text-amber-950"
                    }`}
                  >
                    {done ? "Đã nhận" : "Đang mở"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lối tắt sang Đấu trường Tình huống & Trợ lý Gendio */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/scenarios"
          className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-4 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Đấu trường Tình huống Thực tế
              </p>
              <p className="text-xs text-slate-600">
                Luyện phản xạ từ chối, xử lý tin nhắn lạ & nhận +30 XP mỗi tình huống
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
        </Link>

        <Link
          href="/chat"
          className="bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-200 hover:border-sky-400 rounded-2xl p-4 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Hỏi đáp Kín đáo cùng Trợ lý Gendio
              </p>
              <p className="text-xs text-slate-600">
                Giải đáp thắc mắc tuổi dậy thì (100% riêng tư, không hiển thị cho phụ huynh)
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-sky-700 shrink-0" />
        </Link>
      </section>
    </div>
  );
}
