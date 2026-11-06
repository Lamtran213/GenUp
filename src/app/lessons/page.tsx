"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { TopicCategory } from "@/lib/types";

const FILTER_TOPICS: ("ALL" | TopicCategory)[] = [
  "ALL",
  "Puberty",
  "Boundaries",
  "CyberSafety",
  "Emotion",
];

const LESSON_CARD_THEMES: Record<
  TopicCategory,
  {
    headerBg: string;
    badgeBg: string;
    borderHover: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Puberty: {
    headerBg: "from-emerald-500 to-teal-600",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    borderHover: "hover:border-emerald-400",
    icon: Sparkles,
  },
  Boundaries: {
    headerBg: "from-rose-500 to-orange-500",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
    borderHover: "hover:border-rose-400",
    icon: ShieldCheck,
  },
  CyberSafety: {
    headerBg: "from-sky-500 to-indigo-600",
    badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
    borderHover: "hover:border-sky-400",
    icon: ShieldAlert,
  },
  Emotion: {
    headerBg: "from-amber-500 to-orange-600",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    borderHover: "hover:border-amber-400",
    icon: HeartHandshake,
  },
};

export default function LessonsLibraryPage() {
  const { modules, lessonProgress } = useGenUp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<"ALL" | TopicCategory>("ALL");

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return modules.filter((mod) => {
      const matchTopic =
        selectedTopic === "ALL" || mod.topicCategory === selectedTopic;
      if (!matchTopic) return false;
      if (!q) return true;
      const topicVi = TOPIC_LABELS[mod.topicCategory].toLowerCase();
      return (
        mod.title.toLowerCase().includes(q) ||
        mod.summary.toLowerCase().includes(q) ||
        topicVi.includes(q)
      );
    });
  }, [modules, searchQuery, selectedTopic]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Bản đồ Kiến thức Tương tác
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Thư viện Bài học Chinh phục Kỹ năng
          </h1>
          <p className="text-xs text-slate-600">
            Mỗi bài học chia thành các bước ngắn dễ nhớ, kết thúc bằng tình huống thực hành (+50 XP lần đầu).
          </p>
        </div>

        {/* Ô tìm kiếm (US-08) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài học, chủ đề..."
            className="w-full h-10 pl-3.5 pr-9 rounded-xl bg-white border-2 border-emerald-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-emerald-700 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Bộ lọc chủ đề (US-08) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-clean pb-1">
        {FILTER_TOPICS.map((topic) => {
          const active = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`h-9 px-4 rounded-xl text-xs font-bold shrink-0 transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border-2 border-slate-200 hover:border-emerald-300 hover:text-slate-900"
              }`}
            >
              {topic === "ALL" ? "🌟 Tất cả chủ đề" : TOPIC_LABELS[topic]}
            </button>
          );
        })}

        {(searchQuery.trim() !== "" || selectedTopic !== "ALL") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-3 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại lọc</span>
          </button>
        )}
      </div>

      {/* Danh sách bài học */}
      {filteredModules.length === 0 ? (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              Chưa tìm thấy bài học phù hợp
            </p>
            <p className="text-xs text-slate-500">
              Không có bài học nào khớp với từ khóa &ldquo;{searchQuery}&rdquo; và bộ lọc hiện tại.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc để xem lại thư viện</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredModules.map((mod, idx) => {
            const prog = lessonProgress[mod.id];
            const status = prog?.status ?? "NotStarted";
            const theme = LESSON_CARD_THEMES[mod.topicCategory] || LESSON_CARD_THEMES.Puberty;
            const TopicIcon = theme.icon;
            const stepPercent =
              status === "Completed"
                ? 100
                : status === "InProgress"
                ? Math.round(
                    (((prog?.currentStepIndex ?? 0) + 1) /
                      Math.max(1, mod.steps.length)) *
                      100
                  )
                : 0;

            return (
              <div
                key={mod.id}
                className={`bg-white border-2 border-slate-200 ${theme.borderHover} rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all`}
              >
                <div>
                  {/* Banner màu sắc Gamification */}
                  <div
                    className={`relative h-32 w-full bg-gradient-to-r ${theme.headerBg} p-4 flex flex-col justify-between text-white`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold inline-flex items-center gap-1.5">
                        <TopicIcon className="w-3.5 h-3.5" />
                        {TOPIC_LABELS[mod.topicCategory]}
                      </span>

                      {status === "Completed" && (
                        <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-extrabold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã chinh phục
                        </span>
                      )}
                      {status === "InProgress" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-300 text-slate-950 text-xs font-extrabold">
                          Đang học (Bước {(prog?.currentStepIndex ?? 0) + 1}/{mod.steps.length})
                        </span>
                      )}
                      {status === "NotStarted" && (
                        <span className="px-2.5 py-1 rounded-full bg-black/25 text-white text-xs font-semibold">
                          Chặng #{idx + 1} · Mới
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-white/95">
                      <span>
                        Lớp {mod.targetMinGrade}–{mod.targetMaxGrade} · {mod.estimatedMinutes} phút
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/20 px-2.5 py-0.5 rounded-full font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />+
                        {mod.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {mod.summary}
                    </p>

                    {/* Thanh tiến độ bước học */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{mod.steps.length} bước kiến thức & 1 tình huống</span>
                        <span className="tabular-nums">{stepPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(6, stepPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 tabular-nums">
                    🎁 Thưởng: +{mod.xpReward} XP · +15 Điểm
                  </span>
                  <Link
                    href={`/lessons/${mod.id}`}
                    className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>
                      {status === "Completed"
                        ? "Ôn tập lại"
                        : status === "InProgress"
                        ? "Học tiếp ngay"
                        : "Bắt đầu học"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
