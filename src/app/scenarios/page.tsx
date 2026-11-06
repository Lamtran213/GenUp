"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Gem,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";

const TOPIC_THEME: Record<
  string,
  {
    badge: string;
    activeCard: string;
    banner: string;
    accentText: string;
  }
> = {
  Puberty: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    activeCard: "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20",
    banner: "from-emerald-600 to-teal-600",
    accentText: "text-emerald-700",
  },
  Boundaries: {
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    activeCard: "border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20",
    banner: "from-rose-600 to-orange-500",
    accentText: "text-rose-700",
  },
  CyberSafety: {
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    activeCard: "border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20",
    banner: "from-sky-600 to-indigo-600",
    accentText: "text-sky-700",
  },
  Emotion: {
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    activeCard: "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20",
    banner: "from-amber-500 to-orange-600",
    accentText: "text-amber-800",
  },
};

export default function ScenariosLibraryPage() {
  const {
    scenarios,
    scenarioAttempts,
    isFreeLimitReached,
    submitScenarioChoice,
  } = useGenUp();

  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    scenarios[0]?.id || ""
  );

  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const currentAttempt = activeScenario
    ? scenarioAttempts[activeScenario.id]
    : undefined;
  const chosenOption = activeScenario?.options.find(
    (o) => o.id === currentAttempt?.selectedOptionId
  );

  const completedCount = Object.keys(scenarioAttempts).length;

  if (isFreeLimitReached) {
    return (
      <div className="bg-white border-2 border-amber-200 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h1 className="text-base font-bold text-slate-900">
          Đã hết 15 phút năng lượng thực hành miễn phí hôm nay
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Toàn bộ huy hiệu và kết quả tình huống đã lưu của bạn vẫn được bảo toàn. Hãy quay lại vào ngày mai hoặc nâng cấp gói Premium để mở khóa không giới hạn!
        </p>
        <Link
          href="/premium"
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Mở khóa Năng lượng Không giới hạn</span>
        </Link>
      </div>
    );
  }

  const activeTheme =
    TOPIC_THEME[activeScenario?.topicCategory || "Puberty"] || TOPIC_THEME.Puberty;

  return (
    <div className="space-y-6">
      {/* Banner Đầu trang kiểu Đấu trường Thử thách (Edu Gamification Liquid Glass) */}
      <div className="rounded-3xl liquid-glass-emerald text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Đấu trường Tình huống Thực tế (US-12, US-13)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Thử thách Ra Quyết Định An Toàn
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
            Chọn cách ứng xử thông minh nhất trước các tình huống tuổi học trò để nhận thưởng{" "}
            <strong className="text-amber-200">+30 XP & +20 Điểm đổi đồ</strong> ngay lần đầu chinh phục!
          </p>
        </div>

        {/* Tiến độ chinh phục */}
        <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-3.5 min-w-[180px] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Đã chinh phục</span>
            <span className="tabular-nums text-amber-200">
              {completedCount} / {scenarios.length} thử thách
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(
                  10,
                  Math.round((completedCount / Math.max(1, scenarios.length)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Cột trái: Danh sách Nhiệm vụ Tình huống (4 cột) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Danh sách Thử thách ({scenarios.length})
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              Chọn 1 thẻ để giải
            </span>
          </div>

          {scenarios.map((scen, idx) => {
            const attempt = scenarioAttempts[scen.id];
            const isSelected = scen.id === activeScenario?.id;
            const theme = TOPIC_THEME[scen.topicCategory] || TOPIC_THEME.Puberty;

            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => setActiveScenarioId(scen.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all space-y-2.5 ${
                  isSelected
                    ? theme.activeCard
                    : "liquid-glass border-white/85 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.badge}`}
                    >
                      {TOPIC_LABELS[scen.topicCategory]}
                    </span>
                  </div>

                  {attempt ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã chinh phục
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />+
                      {scen.xpReward} XP
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {scen.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Cột phải: Bàn chơi Tình huống Tương tác Liquid Glass (7 cột) */}
        {activeScenario && (
          <div className="lg:col-span-7 liquid-glass border-2 border-white/85 rounded-2xl overflow-hidden">
            {/* Thanh tiêu đề Thử thách */}
            <div
              className={`bg-gradient-to-r ${activeTheme.banner} text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2`}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                {TOPIC_LABELS[activeScenario.topicCategory]}
              </span>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />+
                  {activeScenario.xpReward} XP
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs inline-flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-sky-200" />+
                  {activeScenario.pointReward} Điểm
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Câu chuyện tình huống */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {activeScenario.title}
                </h2>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    📖 Bối cảnh tình huống:
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {activeScenario.contextDescription}
                  </p>
                </div>

                <p className="text-sm font-bold text-slate-900 pt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{activeScenario.question}</span>
                </p>
              </div>

              {/* Các lựa chọn A / B / C kiểu nút bấm Gamification 3D */}
              <div className="space-y-3">
                {activeScenario.options.map((opt, idx) => {
                  const isChosen = currentAttempt?.selectedOptionId === opt.id;
                  const optionLetter = String.fromCharCode(65 + idx); // A, B, C

                  let cardStyle =
                    "bg-white/55 backdrop-blur-md border-2 border-b-4 border-white/85 hover:border-emerald-400 hover:bg-white/75 text-slate-800";
                  let badgeStyle =
                    "bg-white/80 text-slate-700 border border-white";

                  if (isChosen) {
                    if (opt.isRecommended) {
                      cardStyle =
                        "bg-emerald-50 border-2 border-b-4 border-emerald-500 text-emerald-950";
                      badgeStyle = "bg-emerald-600 text-white";
                    } else {
                      cardStyle =
                        "bg-amber-50 border-2 border-b-4 border-amber-500 text-amber-950";
                      badgeStyle = "bg-amber-500 text-white";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => submitScenarioChoice(activeScenario.id, opt.id)}
                      className={`w-full p-4 rounded-2xl text-left transition-all active:translate-y-0.5 ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                          >
                            {optionLetter}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {opt.text}
                          </span>
                        </div>
                        {isChosen && (
                          <CheckCircle2
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              opt.isRecommended
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hộp Phản hồi Gamification & Mở khóa Phần thưởng */}
              {chosenOption ? (
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <div
                    className={`p-4 rounded-2xl border-2 space-y-2 ${
                      chosenOption.isRecommended
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : "bg-amber-50 border-amber-300 text-amber-950"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                        {chosenOption.isRecommended ? (
                          <>
                            <Award className="w-4 h-4 text-emerald-600" />
                            <span>Tuyệt vời! Quyết định chuẩn xác & an toàn</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            <span>Gợi ý để xử lý an toàn hơn</span>
                          </>
                        )}
                      </span>

                      {chosenOption.isRecommended && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                          +{activeScenario.xpReward} XP · +{activeScenario.pointReward} Điểm
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold">
                      {chosenOption.immediateFeedback}
                    </p>
                    <p className="text-xs leading-relaxed opacity-90">
                      {chosenOption.detailedExplanation}
                    </p>
                  </div>

                  {/* Nhắc nhở quy tắc an toàn */}
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2.5 text-xs text-sky-950">
                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Ghi nhớ an toàn: </strong>
                      <span>{activeScenario.safetyReminder}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/result/${activeScenario.id}`}
                      className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Xem Tổng kết & Nhận Huy hiệu</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    👆 Hãy chạm vào một phương án (A, B hoặc C) để kiểm tra phản xạ của bạn!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
