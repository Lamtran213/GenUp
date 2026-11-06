"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, RotateCcw, Search } from "lucide-react";
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

export default function LessonsLibraryPage() {
  const { modules, lessonProgress } = useGenUp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<"ALL" | TopicCategory>("ALL");

  // US-08 AC1, AC2: Kết hợp tìm kiếm từ khóa (tiêu đề, mô tả, chủ đề) và lọc theo chủ đề
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
          <h1 className="text-xl font-semibold tracking-tight">Thư viện bài học</h1>
          <p className="text-xs text-muted">
            Khám phá kiến thức theo từng bước ngắn và thực hành tình huống cuối bài (+50 XP lần đầu).
          </p>
        </div>

        {/* Ô tìm kiếm (US-08) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài học, chủ đề..."
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface border border-border-strong text-xs focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
          />
          <Search className="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none" />
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
              className={`h-9 px-3.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted border border-border-strong hover:bg-button-hover hover:text-foreground"
              }`}
            >
              {topic === "ALL" ? "Tất cả chủ đề" : TOPIC_LABELS[topic]}
            </button>
          );
        })}

        {(searchQuery.trim() !== "" || selectedTopic !== "ALL") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-3 rounded-xl text-xs font-medium text-muted hover:text-foreground inline-flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại lọc</span>
          </button>
        )}
      </div>

      {/* Danh sách bài học hoặc Trạng thái rỗng (US-08 AC3) */}
      {filteredModules.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-background mx-auto flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-muted" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Chưa tìm thấy bài học phù hợp</p>
            <p className="text-xs text-muted">
              Không có bài học nào khớp với từ khóa &ldquo;{searchQuery}&rdquo; và bộ lọc hiện tại.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc để xem lại thư viện</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((mod) => {
            const prog = lessonProgress[mod.id];
            const status = prog?.status ?? "NotStarted";

            return (
              <div
                key={mod.id}
                className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Ảnh bìa hoặc khung fallback ca biên S8 */}
                  <div className="relative h-40 w-full bg-background border-b border-border overflow-hidden">
                    {mod.coverImage ? (
                      <Image
                        src={mod.coverImage}
                        alt={mod.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-1.5">
                        <BookOpen className="w-6 h-6" />
                        <span className="text-xs">Chưa có ảnh minh họa</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-surface/95 text-foreground text-xs font-medium">
                        {TOPIC_LABELS[mod.topicCategory]}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {status === "Completed" && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                          Đã hoàn thành
                        </span>
                      )}
                      {status === "InProgress" && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                          Đang học (Bước {(prog?.currentStepIndex ?? 0) + 1}/{mod.steps.length})
                        </span>
                      )}
                      {status === "NotStarted" && (
                        <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                          Chưa học
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted tabular-nums">
                      <span>Lớp {mod.targetMinGrade}–{mod.targetMaxGrade}</span>
                      <span>·</span>
                      <span>{mod.estimatedMinutes} phút</span>
                      <span>·</span>
                      <span>{mod.steps.length} bước kiến thức</span>
                    </div>
                    <h2 className="text-base font-semibold leading-snug line-clamp-2">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {mod.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-muted tabular-nums">
                    Thưởng lần đầu: +{mod.xpReward} XP
                  </span>
                  <Link
                    href={`/lessons/${mod.id}`}
                    className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    <span>
                      {status === "Completed"
                        ? "Mở ôn tập lại"
                        : status === "InProgress"
                        ? "Tiếp tục học"
                        : "Vào học"}
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

