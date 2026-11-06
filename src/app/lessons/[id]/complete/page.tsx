"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowRight, Award, BookOpen, CheckCircle2 } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";

export default function LessonCompletePage() {
  const params = useParams<{ id: string }>();
  const { modules, lessonProgress, profile, getRecommendedNextModule } = useGenUp();

  const moduleId = params?.id || "";
  const mod = modules.find((m) => m.id === moduleId);
  const prog = lessonProgress[moduleId];

  // US-18 AC3: Chặn truy cập trực tiếp đường dẫn /complete khi bài học chưa hoàn thành
  if (!mod || prog?.status !== "Completed") {
    return (
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
        <h1 className="text-base font-semibold">
          Bài học chưa hoàn tất điều kiện tổng kết
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          Bạn cần đọc các bước kiến thức và trả lời tình huống thực hành trước khi mở trang tổng kết hoàn thành bài.
        </p>
        <Link
          href={mod ? `/lessons/${mod.id}` : "/lessons"}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
        >
          <span>Quay về bài học để hoàn tất</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const nextModule = getRecommendedNextModule(mod.id);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-surface border border-border rounded-xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-emerald-700">
            Hoàn thành bài học (US-15)
          </span>
          <h1 className="text-xl font-semibold tracking-tight">{mod.title}</h1>
          <p className="text-xs text-muted">
            Thành tích của bạn đã được lưu lại. Học lại bài này để ôn tập sẽ không cộng trùng 50 XP lần đầu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-1">
          <div className="p-3 rounded-xl bg-background">
            <p className="text-xs text-muted">Tổng XP hiện tại</p>
            <p className="text-lg font-semibold tabular-nums">{profile.totalXp} XP</p>
          </div>
          <div className="p-3 rounded-xl bg-background">
            <p className="text-xs text-muted">Chuỗi ngày học</p>
            <p className="text-lg font-semibold tabular-nums">
              {profile.currentStreak} ngày
            </p>
          </div>
        </div>
      </div>

      {/* Gợi ý bài học tiếp theo (US-18 AC1, AC2, AC4) */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">
            Gợi ý bước tiếp theo (US-18)
          </span>
          {nextModule && (
            <span className="px-2 py-0.5 rounded-md bg-background text-xs font-medium">
              {TOPIC_LABELS[nextModule.topicCategory]}
            </span>
          )}
        </div>

        {nextModule ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">{nextModule.title}</h2>
              <p className="text-xs text-muted">{nextModule.summary}</p>
            </div>
            <Link
              href={`/lessons/${nextModule.id}`}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Học bài tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">
                Tuyệt vời! Bạn đã hoàn thành tất cả bài học trong thư viện
              </h2>
              <p className="text-xs text-muted">
                Bạn có thể quay về thư viện để ôn tập hoặc dùng điểm thưởng mở khóa trang phục mới.
              </p>
            </div>
            <Link
              href="/lessons"
              className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ôn tập thư viện</span>
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <Link href="/dashboard" className="text-muted hover:text-foreground">
          ← Về Bảng điều khiển
        </Link>
        <Link
          href="/rewards"
          className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Mở Cửa hàng đổi vật phẩm</span>
        </Link>
      </div>
    </div>
  );
}

