"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Compass } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";

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

  if (isFreeLimitReached) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center space-y-3 max-w-lg mx-auto">
        <Clock className="w-8 h-8 text-amber-700 mx-auto" />
        <h1 className="text-base font-semibold">
          Đã hết 15 phút thực hành miễn phí trong ngày
        </h1>
        <p className="text-xs text-muted">
          Toàn bộ kết quả tình huống đã lưu của bạn vẫn được giữ nguyên. Hãy quay lại vào ngày mai hoặc nâng cấp gói Premium.
        </p>
        <Link
          href="/premium"
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center"
        >
          Xem quyền lợi Premium
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Thư viện Tình huống Thực hành (US-12, US-13)
        </h1>
        <p className="text-xs text-muted">
          Luyện tập ra quyết định an toàn độc lập, nhận phản hồi không phán xét và lời giải thích chi tiết (+30 XP lần đầu).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Danh sách chọn tình huống bên trái */}
        <div className="space-y-2.5">
          {scenarios.map((scen) => {
            const attempt = scenarioAttempts[scen.id];
            const isSelected = scen.id === activeScenario?.id;
            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => setActiveScenarioId(scen.id)}
                className={`w-full p-4 rounded-xl border text-left transition-colors space-y-1.5 ${
                  isSelected
                    ? "bg-surface border-primary"
                    : "bg-surface border-border hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-background text-[11px] font-medium">
                    {TOPIC_LABELS[scen.topicCategory]}
                  </span>
                  {attempt ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                      Đã thực hành
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                      +{scen.xpReward} XP
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold leading-snug">{scen.title}</p>
              </button>
            );
          })}
        </div>

        {/* Khung thực hành tình huống chi tiết bên phải */}
        {activeScenario && (
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Compass className="w-3.5 h-3.5" />
                  {TOPIC_LABELS[activeScenario.topicCategory]}
                </span>
                <span className="text-xs text-muted tabular-nums">
                  Thưởng lần đầu: +{activeScenario.xpReward} XP · +{activeScenario.pointReward} Điểm
                </span>
              </div>

              <h2 className="text-lg font-semibold">{activeScenario.title}</h2>
              <p className="text-sm text-foreground leading-relaxed bg-background p-4 rounded-xl border border-border-strong">
                {activeScenario.contextDescription}
              </p>
              <p className="text-xs font-semibold text-foreground pt-1">
                {activeScenario.question}
              </p>
            </div>

            <div className="space-y-2.5">
              {activeScenario.options.map((opt) => {
                const isChosen = currentAttempt?.selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => submitScenarioChoice(activeScenario.id, opt.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      isChosen
                        ? "bg-secondary border-primary"
                        : "bg-surface border-border-strong hover:bg-button-hover"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium leading-relaxed">
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

            {/* Phản hồi tức thì & Nút mở trang Kết quả giải thích chi tiết (US-13, US-14) */}
            {chosenOption ? (
              <div className="space-y-3 pt-2 border-t border-border">
                <div
                  className={`p-4 rounded-xl border space-y-1 ${
                    chosenOption.isRecommended
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    {chosenOption.immediateFeedback}
                  </p>
                  <p className="text-xs leading-relaxed">
                    {chosenOption.detailedExplanation}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={`/result/${activeScenario.id}`}
                    className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    <span>Xem kết quả & giải thích chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>Hãy chọn một phương án ở trên để xem phản hồi và kết quả chi tiết.</span>
                <button
                  type="button"
                  disabled
                  className="h-9 px-4 rounded-xl bg-secondary text-muted text-xs font-medium cursor-not-allowed"
                >
                  Xem kết quả chi tiết
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

