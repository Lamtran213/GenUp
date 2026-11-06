"use client";

import React, { useState } from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { TOPIC_LABELS } from "@/lib/seed-data";
import { ModuleStatus } from "@/lib/types";

export default function AdminCmsPage() {
  const { modules } = useGenUp();
  const [statuses, setStatuses] = useState<Record<string, ModuleStatus>>(() =>
    Object.fromEntries(modules.map((m) => [m.id, m.status]))
  );
  const [notice, setNotice] = useState<string | null>(null);

  const handleStatusChange = (id: string, nextStatus: ModuleStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: nextStatus }));
    setNotice(
      `Đã chuyển trạng thái bài học "${id}" sang "${nextStatus}" (US-51). Chỉ bài ở trạng thái Published mới hiển thị công khai.`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          CMS Quản trị & Kiểm duyệt Nội dung Giáo dục (UC-28, US-51)
        </h1>
        <p className="text-xs text-muted">
          Quy trình kiểm duyệt chuyên gia tâm lý: Draft (Bản nháp) → PendingReview (Chờ duyệt) → Approved → Published (Xuất bản).
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-strong bg-background text-xs font-semibold text-muted">
                <th className="py-3 px-4">Bài học</th>
                <th className="py-3 px-4">Chủ đề</th>
                <th className="py-3 px-4">Khối lớp</th>
                <th className="py-3 px-4">Trạng thái xuất bản</th>
                <th className="py-3 px-4 text-right">Thao tác kiểm duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {modules.map((mod) => {
                const st = statuses[mod.id] || mod.status;
                return (
                  <tr key={mod.id} className="hover:bg-surface-hover">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted shrink-0" />
                        <span>{mod.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {TOPIC_LABELS[mod.topicCategory]}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-muted">
                      Lớp {mod.targetMinGrade}–{mod.targetMaxGrade}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-medium ${
                          st === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : st === "Approved"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {st}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {(["Draft", "PendingReview", "Approved", "Published"] as const).map(
                          (target) => (
                            <button
                              key={target}
                              type="button"
                              onClick={() => handleStatusChange(mod.id, target)}
                              className={`h-7 px-2.5 rounded-lg border text-[11px] font-medium ${
                                st === target
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-surface text-muted border-border-strong hover:bg-button-hover"
                              }`}
                            >
                              {target}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

