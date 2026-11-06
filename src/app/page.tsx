"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";

export default function LandingPage() {
  const { profile, modules } = useGenUp();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header tối giản */}
      <header className="h-16 bg-surface border-b border-border-strong px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
            G
          </span>
          <div>
            <span className="font-semibold text-base tracking-tight block leading-none">
              GenUp
            </span>
            <span className="text-xs text-muted">
              Lớn lên tự tin, an toàn mỗi ngày
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-sm font-medium flex items-center"
          >
            Đăng nhập / Chọn khu vực
          </Link>
          <Link
            href="/dashboard"
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium flex items-center gap-1.5"
          >
            <span>Vào học ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Khối chính */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 space-y-8">
        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background text-foreground text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Dành cho Học sinh THCS (11–15 tuổi · Lớp 6–9) & Phụ huynh
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Giáo dục giới tính, cảm xúc & kỹ năng tự bảo vệ qua tình huống tương tác
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Tiếp cận kiến thức khoa học không phán xét, thực hành xử lý tình huống thực tế,
              tích lũy XP cho nhân vật 2D Avatar và đồng hành cùng phụ huynh với nguyên tắc
              tôn trọng quyền riêng tư của trẻ (NFR-S06).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium inline-flex items-center gap-2"
              >
                <span>Tiếp tục hồ sơ ({profile.nickname})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/onboarding"
                className="h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-sm font-medium inline-flex items-center"
              >
                Tạo hồ sơ học sinh mới
              </Link>
              <Link
                href="/parent"
                className="h-10 px-4 rounded-xl bg-secondary hover:bg-secondary-hover text-foreground text-sm font-medium inline-flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Mở Góc Phụ Huynh</span>
              </Link>
            </div>
          </div>

          {/* Tóm tắt trạng thái kiến trúc hệ thống */}
          <div className="w-full lg:w-80 bg-background rounded-xl p-4 space-y-3 border border-border-strong">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Kiến trúc Full-Stack đang chạy
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Frontend & API</span>
                <span className="font-medium">Next.js App Router (Vercel)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Dữ liệu & RLS</span>
                <span className="font-medium">Supabase PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Chat Gendio & Hộp thư</span>
                <span className="font-medium">MongoDB Atlas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Push Notification</span>
                <span className="font-medium">Firebase FCM</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 trụ cột giá trị sản phẩm theo Mục 1.2 & 1.5 SRS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-sm font-semibold">
              {modules.length} Chủ đề có cấu trúc
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Chia nhỏ thành từng bước kiến thức ngắn kèm thanh tiến độ, tự động lưu vị trí đang học dở.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-sm font-semibold">
              Tình huống & Gamification
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Nhận phản hồi giải thích ngay lập tức (+50 XP bài học, +30 XP tình huống) và đổi đồ 2D Avatar.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
              <Clock className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-sm font-semibold">
              Smart Timer 15 phút Free
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Học thử miễn phí 15 phút/ngày; tự động tạm dừng khi ẩn tab hoặc không tương tác quá 60 giây.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
              <Lock className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-sm font-semibold">
              Parent Dashboard Bảo mật
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Phụ huynh nắm bắt tiến độ tổng hợp 7/14/30 ngày mà không xâm phạm câu trả lời hay chat riêng của con.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

