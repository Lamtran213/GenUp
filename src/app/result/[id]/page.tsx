"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";

export default function ScenarioResultPage() {
  const params = useParams<{ id: string }>();
  const { scenarios, scenarioAttempts } = useGenUp();

  const scenarioId = params?.id || "";
  const scen = scenarios.find((s) => s.id === scenarioId);
  const attempt = scenarioAttempts[scenarioId];
  const chosenOption = scen?.options.find((o) => o.id === attempt?.selectedOptionId);
  const recommendedOption = scen?.options.find((o) => o.isRecommended);

  // US-12 AC3: Tình huống không tồn tại
  if (!scen) {
    return (
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-error-text mx-auto" />
        <h1 className="text-base font-semibold">Không tìm thấy tình huống</h1>
        <Link
          href="/scenarios"
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay về danh sách tình huống</span>
        </Link>
      </div>
    );
  }

  // US-14 AC3: Chưa chọn đáp án hợp lệ mà truy cập thẳng URL kết quả
  if (!attempt || !chosenOption) {
    return (
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-xl p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
        <h1 className="text-base font-semibold">
          Bạn chưa chọn phương án cho tình huống này
        </h1>
        <p className="text-xs text-muted">
          Hãy đọc bối cảnh và đưa ra lựa chọn xử lý trước khi xem phân tích kết quả chi tiết.
        </p>
        <Link
          href="/scenarios"
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay về trang tình huống</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link
        href="/scenarios"
        className="text-xs font-medium text-muted hover:text-foreground inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại Thư viện tình huống</span>
      </Link>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-background text-xs font-medium">
            {TOPIC_LABELS[scen.topicCategory]} · Phân tích kết quả (US-14)
          </span>
          <h1 className="text-lg font-semibold pt-1">{scen.title}</h1>
          <p className="text-xs text-muted leading-relaxed">
            {scen.contextDescription}
          </p>
        </div>

        {/* Lựa chọn của người học */}
        <div
          className={`p-4 rounded-xl border space-y-1.5 ${
            chosenOption.isRecommended
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <p className="text-xs font-semibold">
            Phương án bạn đã chọn: &ldquo;{chosenOption.text}&rdquo;
          </p>
          <p className="text-xs font-medium">{chosenOption.immediateFeedback}</p>
          <p className="text-xs leading-relaxed">{chosenOption.detailedExplanation}</p>
        </div>

        {/* Gợi ý phương án an toàn nhất nếu học sinh chọn phương án chưa phù hợp (US-14 AC2) */}
        {!chosenOption.isRecommended && recommendedOption && (
          <div className="p-4 rounded-xl bg-background border border-border-strong space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Gợi ý hướng xử lý an toàn hơn:</span>
            </p>
            <p className="text-xs font-medium text-foreground">
              &ldquo;{recommendedOption.text}&rdquo;
            </p>
            <p className="text-xs text-muted leading-relaxed">
              {recommendedOption.detailedExplanation}
            </p>
          </div>
        )}

        {/* Nguyên tắc an toàn cần ghi nhớ (US-14 AC1) */}
        <div className="p-4 rounded-xl bg-background border border-border-strong flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold">Nguyên tắc an toàn cần ghi nhớ</p>
            <p className="text-xs text-muted leading-relaxed">
              {scen.safetyReminder}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <Link
            href="/scenarios"
            className="h-9 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
          >
            Thử lại hoặc chọn tình huống khác
          </Link>
          <Link
            href="/progress"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center"
          >
            Xem tiến độ học tập
          </Link>
        </div>
      </div>
    </div>
  );
}

