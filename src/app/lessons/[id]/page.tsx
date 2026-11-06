"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";

export default function LessonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    modules,
    scenarios,
    lessonProgress,
    scenarioAttempts,
    isFreeLimitReached,
    saveLessonStep,
    submitScenarioChoice,
    completeLesson,
    reviewCompletedLesson,
  } = useGenUp();

  const moduleId = params?.id || "";
  const mod = modules.find((m) => m.id === moduleId);

  const savedProg = lessonProgress[moduleId];
  const [stepIdx, setStepIdx] = useState<number>(savedProg?.currentStepIndex ?? 0);
  const [inScenarioStage, setInScenarioStage] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Đồng bộ lại bước đã lưu khi tải xong LocalStorage (US-10 AC4, US-17 AC1)
  useEffect(() => {
    if (savedProg && typeof savedProg.currentStepIndex === "number" && mod) {
      const validStep = Math.max(
        0,
        Math.min(mod.steps.length - 1, savedProg.currentStepIndex)
      );
      setStepIdx(validStep);
    }
  }, [savedProg?.currentStepIndex, mod]);

  // US-07 AC3 & US-09 AC3: Xử lý đường dẫn bài học không tồn tại
  if (!mod) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-error-text mx-auto" />
        <h1 className="text-base font-semibold">Không tìm thấy bài học</h1>
        <p className="text-xs text-muted">
          Mã bài học &ldquo;{moduleId}&rdquo; không tồn tại trong thư viện GenUp.
        </p>
        <Link
          href="/lessons"
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Thư viện bài học</span>
        </Link>
      </div>
    );
  }

  // US-30 AC3: Chặn học thêm khi đã dùng hết 15 phút Free trong ngày (nhưng giữ nguyên tiến độ)
  if (isFreeLimitReached) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-semibold">
          Bạn đã sử dụng hết 15 phút học miễn phí hôm nay
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          Toàn bộ tiến độ bài học &ldquo;{mod.title}&rdquo; (Bước {stepIdx + 1}/
          {mod.steps.length}), điểm XP và chuỗi Streak của bạn đều được bảo toàn. Bạn có thể
          quay lại học tiếp vào ngày mai hoặc nhờ Phụ huynh mở khóa gói Premium không giới hạn.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Link
            href="/dashboard"
            className="h-9 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
          >
            Về Bảng điều khiển
          </Link>
          <Link
            href="/premium"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center"
          >
            Xem gói Premium không giới hạn
          </Link>
        </div>
      </div>
    );
  }

  const linkedScenario = scenarios.find((s) => s.id === mod.scenarioId);
  const currentStep = mod.steps[stepIdx] ?? mod.steps[0];
  const selectedOptionId =
    savedProg?.selectedOptionId ||
    (linkedScenario ? scenarioAttempts[linkedScenario.id]?.selectedOptionId : undefined);
  const selectedOption = linkedScenario?.options.find((o) => o.id === selectedOptionId);

  const handlePrev = () => {
    setActionAlert(null);
    if (inScenarioStage) {
      setInScenarioStage(false);
      return;
    }
    // US-10 AC2: Ở bước đầu tiên nhấn Quay lại sẽ đưa về thư viện, không tạo bước âm
    if (stepIdx <= 0) {
      router.push("/lessons");
      return;
    }
    const prevIdx = stepIdx - 1;
    setStepIdx(prevIdx);
    saveLessonStep(mod.id, prevIdx);
  };

  const handleNext = () => {
    setActionAlert(null);
    if (stepIdx < mod.steps.length - 1) {
      const nextIdx = stepIdx + 1;
      setStepIdx(nextIdx);
      saveLessonStep(mod.id, nextIdx);
    } else {
      // US-09 AC2: Đến cuối phần kiến thức chuyển sang phần thực hành tình huống của bài
      setInScenarioStage(true);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (!linkedScenario) return;
    setActionAlert(null);
    submitScenarioChoice(linkedScenario.id, optionId, mod.id);
  };

  const handleCompleteLesson = () => {
    const result = completeLesson(mod.id);
    if (!result.ok) {
      setActionAlert(result.reason || "Chưa đủ điều kiện hoàn thành bài học.");
      return;
    }
    router.push(`/lessons/${mod.id}/complete`);
  };

  const handleReviewLesson = () => {
    const res = reviewCompletedLesson(mod.id);
    setActionAlert(res.message);
  };

  const totalStages = mod.steps.length + 1;
  const currentStageNum = inScenarioStage ? totalStages : stepIdx + 1;
  const progressPercent = Math.round((currentStageNum / totalStages) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Thanh điều hướng trên cùng */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/lessons"
          className="text-xs font-medium text-muted hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Thư viện bài học</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-surface border border-border-strong text-xs font-medium">
            {TOPIC_LABELS[mod.topicCategory]}
          </span>
          {savedProg?.status === "Completed" && (
            <button
              type="button"
              onClick={handleReviewLesson}
              className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Xác nhận ôn tập hôm nay (US-16)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tiêu đề & Thanh tiến độ từng bước (US-09, US-10) */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs text-muted tabular-nums">
          <span>
            {inScenarioStage
              ? `Bước thực hành tình huống (${totalStages}/${totalStages})`
              : `Bước kiến thức ${stepIdx + 1} / ${mod.steps.length}`}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-background overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">{mod.title}</h1>
      </div>

      {actionAlert && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          {actionAlert}
        </div>
      )}

      {/* Nội dung Bước kiến thức hoặc Tình huống thực hành cuối bài */}
      {!inScenarioStage ? (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted">
              Phần {stepIdx + 1}:
            </span>
            <h2 className="text-base font-semibold">{currentStep.title}</h2>
            <p className="text-sm text-foreground leading-relaxed">
              {currentStep.content}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border-strong space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Điểm cốt lõi cần nhớ:
            </p>
            <p className="text-xs text-muted leading-relaxed">
              {currentStep.keyTakeaway}
            </p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{stepIdx === 0 ? "Về Thư viện" : "Quay lại bước trước"}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
            >
              <span>
                {stepIdx < mod.steps.length - 1
                  ? "Tiếp tục bước sau"
                  : "Chuyển sang Thực hành tình huống"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-background text-foreground text-xs font-medium">
              Tình huống tương tác bắt buộc (US-11, US-15)
            </span>
            <h2 className="text-base font-semibold pt-1">
              {linkedScenario?.title}
            </h2>
            <p className="text-sm text-foreground leading-relaxed">
              {linkedScenario?.contextDescription}
            </p>
            <p className="text-xs font-semibold text-foreground pt-1">
              Câu hỏi: {linkedScenario?.question}
            </p>
          </div>

          {/* Danh sách phương án lựa chọn */}
          <div className="space-y-2.5">
            {linkedScenario?.options.map((opt) => {
              const isChosen = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-colors space-y-1 ${
                    isChosen
                      ? "bg-secondary border-primary"
                      : "bg-surface border-border-strong hover:bg-button-hover"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-foreground leading-relaxed">
                      {opt.text}
                    </span>
                    {isChosen && (
                      <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Phản hồi ngay sau khi chọn (US-13) */}
          {selectedOption && (
            <div
              className={`p-4 rounded-xl border space-y-1.5 ${
                selectedOption.isRecommended
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <p className="text-xs font-semibold">
                {selectedOption.immediateFeedback}
              </p>
              <p className="text-xs leading-relaxed">
                {selectedOption.detailedExplanation}
              </p>
              <p className="text-[11px] opacity-80 pt-1">
                💡 Bạn có thể thử chọn phương án khác để xem hệ quả, hoặc nhấn Hoàn thành bài học bên dưới.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Xem lại kiến thức</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteLesson}
              disabled={!selectedOptionId}
              className={`h-10 px-5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 ${
                selectedOptionId
                  ? "bg-primary hover:bg-primary-hover text-primary-foreground"
                  : "bg-secondary text-muted cursor-not-allowed"
              }`}
            >
              <span>Hoàn thành bài học (+50 XP lần đầu)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

