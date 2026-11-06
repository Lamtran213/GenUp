"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { parentSettings, updateParentSettings } = useGenUp();

  const handleConfirmDemoPayment = () => {
    updateParentSettings({ planType: "PremiumYearly" });
    router.push("/premium");
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <Link
        href="/premium"
        className="text-xs font-medium text-muted hover:text-foreground inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại bảng so sánh gói (Không tự động thu tiền - US-32 AC3)</span>
      </Link>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted">
            Cổng thanh toán mô phỏng (US-49 AC4)
          </span>
          <h1 className="text-lg font-semibold">
            Xác nhận nâng cấp GenUp Premium Gia Đình
          </h1>
          <p className="text-xs text-muted">
            Trạng thái hiện tại:{" "}
            <strong className="text-foreground">{parentSettings.planType}</strong>. Nếu bạn rời trang mà không nhấn xác nhận, trạng thái gói sẽ giữ nguyên.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border-strong space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Gói đăng ký</span>
            <span className="font-semibold">GenUp Premium 12 Tháng</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Phương thức dự kiến</span>
            <span className="font-medium">VNPAY / VietQR (Chế độ Demo)</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-medium">Tổng thanh toán (Mô phỏng)</span>
            <span className="text-base font-semibold tabular-nums">500.000 VNĐ</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Đây là luồng mô phỏng phục vụ kiểm thử MVP theo đúng đặc tả US-49 AC4 (không phát sinh giao dịch ngân hàng thật).
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/premium"
            className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center"
          >
            Hủy giao dịch
          </Link>

          <button
            type="button"
            onClick={handleConfirmDemoPayment}
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận kích hoạt Premium Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

