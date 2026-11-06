"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";

export default function ParentEmailSettingsPage() {
  const { parentSettings, updateParentSettings } = useGenUp();
  const [saved, setSaved] = useState(false);

  const toggleKey = (
    key:
      | "notifyProgressReport"
      | "notifyStudyReminder"
      | "notifyNewContent"
      | "notifyPremiumOffer"
  ) => {
    setSaved(true);
    updateParentSettings({ [key]: !parentSettings[key] });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Cài đặt Loại & Tần suất Thông báo Email (US-39)
        </h1>
        <p className="text-xs text-muted">
          Kiểm soát các nhóm thông báo được tạo trong Hộp thư Phụ huynh và tần suất tổng hợp báo cáo (7/14/30 ngày).
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu tùy chọn thông báo email. Các loại đã tắt sẽ không tạo thư mới (US-39 AC3).</span>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold">1. Tần suất chu kỳ báo cáo học tập</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setSaved(true);
                updateParentSettings({ reportFrequencyDays: days });
              }}
              className={`h-10 rounded-xl border text-xs font-medium ${
                parentSettings.reportFrequencyDays === days
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-foreground border-border-strong hover:bg-button-hover"
              }`}
            >
              Chu kỳ {days} ngày
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold">2. Bật / Tắt từng loại thông báo</h2>

        {[
          {
            key: "notifyProgressReport" as const,
            title: "Báo cáo tiến độ học tập định kỳ",
            desc: "Tổng hợp số bài hoàn thành, tình huống và chuỗi ngày học của con.",
          },
          {
            key: "notifyStudyReminder" as const,
            title: "Lời nhắc duy trì thói quen học tập",
            desc: "Nhắc nhở nhẹ nhàng khi con có nguy cơ gián đoạn chuỗi Learning Streak.",
          },
          {
            key: "notifyNewContent" as const,
            title: "Thông báo bài học & tình huống mới",
            desc: "Cập nhật khi đội ngũ chuyên gia xuất bản chủ đề giáo dục mới.",
          },
          {
            key: "notifyPremiumOffer" as const,
            title: "Thông tin gói dịch vụ Premium",
            desc: "Thông báo thay đổi trạng thái gói hoặc ưu đãi nâng cấp gia đình.",
          },
        ].map((item) => {
          const enabled = parentSettings[item.key];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-xs font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleKey(item.key)}
                className={`h-8 px-3.5 rounded-lg text-xs font-medium shrink-0 ${
                  enabled
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {enabled ? "Đang bật" : "Đang tắt"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

