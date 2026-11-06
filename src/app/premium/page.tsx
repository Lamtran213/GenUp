"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";

export default function PremiumComparisonPage() {
  const { parentSettings, updateParentSettings, profile } = useGenUp();
  const [billingCycle, setBillingCycle] = useState<"year" | "month">("year");

  const isPremium = parentSettings.planType !== "Free";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            So sánh Gói Free & GenUp Premium (US-32, US-49)
          </h1>
          <p className="text-xs text-muted">
            Chuyển đổi gói dịch vụ bảo toàn 100% tiến độ bài học, chuỗi Streak và {profile.totalXp} XP hiện có (US-32 AC4).
          </p>
        </div>

        {/* Chuyển chu kỳ Tháng / Năm (US-32 AC2) */}
        <div
          className="inline-flex p-1 rounded-xl bg-surface border border-border-strong"
          style={{ boxShadow: "var(--shadow-segment-track)" }}
        >
          <button
            type="button"
            onClick={() => setBillingCycle("year")}
            className={`h-8 px-3 rounded-lg text-xs font-medium ${
              billingCycle === "year"
                ? "bg-background text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Theo Năm (Tiết kiệm 30%)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("month")}
            className={`h-8 px-3 rounded-lg text-xs font-medium ${
              billingCycle === "month"
                ? "bg-background text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Theo Tháng
          </button>
        </div>
      </div>

      {/* 2 Thẻ so sánh gói */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Gói Free (Trải nghiệm)</h2>
              {!isPremium && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                  Đang sử dụng
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold tabular-nums">0đ / mãi mãi</p>
            <p className="text-xs text-muted">
              Phù hợp để phụ huynh và học sinh dùng thử trước khi quyết định đồng hành dài hạn.
            </p>

            <ul className="space-y-2 pt-2 text-xs">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>15 phút học tương tác chủ động mỗi ngày (Smart Timer US-30, US-31)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Truy cập thư viện bài học & tình huống cơ bản</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Giữ nguyên toàn bộ tiến độ khi hết giờ trong ngày</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => updateParentSettings({ planType: "Free" })}
            disabled={!isPremium}
            className={`w-full h-10 rounded-xl text-xs font-medium ${
              !isPremium
                ? "bg-secondary text-muted cursor-not-allowed"
                : "border border-border-strong bg-surface hover:bg-button-hover text-foreground"
            }`}
          >
            {!isPremium ? "Gói hiện tại của bạn" : "Chuyển về gói Free (Demo)"}
          </button>
        </div>

        <div className="bg-surface border-2 border-primary rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-base font-semibold">
                <Sparkles className="w-4 h-4" />
                GenUp Premium Gia Đình
              </span>
              {isPremium && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                  Đang kích hoạt
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold tabular-nums">
              {billingCycle === "year" ? "500.000đ / năm" : "59.000đ / tháng"}
            </p>
            <p className="text-xs text-muted">
              Mức giá đề xuất theo khảo sát phụ huynh mục 1.4.2 SRS (~41.000đ/tháng khi đăng ký năm).
            </p>

            <ul className="space-y-2 pt-2 text-xs">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium">
                  Không giới hạn thời lượng học tập & thực hành tình huống mỗi ngày
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Mở khóa toàn bộ kịch bản tình huống chuyên sâu & vật phẩm đặc biệt</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Báo cáo định kỳ 7/14/30 ngày & Gợi ý đồng hành cho Phụ huynh</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/premium/checkout?cycle=${billingCycle}`}
              className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center justify-center"
            >
              Tiếp tục tới trang Thanh toán
            </Link>
            <button
              type="button"
              onClick={() =>
                updateParentSettings({
                  planType:
                    billingCycle === "year" ? "PremiumYearly" : "PremiumMonthly",
                })
              }
              className="h-10 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium"
            >
              Bật nhanh Premium Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

