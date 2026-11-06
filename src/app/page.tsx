"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  HeartHandshake,
  Lock,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Avatar2D } from "@/components/avatar/Avatar2D";

interface CarouselSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaLabel: string;
  ctaHref: string;
  bgClass: string;
  accentClass: string;
  pillClass: string;
  highlights: string[];
}

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: "slide-puberty",
    tag: "Chủ đề 01 · Cơ thể & Tuổi dậy thì",
    title: "Hiểu đúng về cơ thể — Tự tin đón nhận tuổi dậy thì",
    subtitle:
      "Bài học chia nhỏ từng bước trực quan giúp học sinh lớp 6–9 hiểu về thay đổi thể chất, giọng nói, làn da và cách tự chăm sóc khoa học mà không ngại ngùng.",
    badgeText: "+50 XP & +15 Điểm khi hoàn thành bài học đầu tiên",
    ctaLabel: "Khám phá Thư viện Bài học",
    ctaHref: "/lessons",
    bgClass: "from-emerald-600 via-teal-600 to-cyan-700",
    accentClass: "bg-emerald-500/20 border-emerald-300/30 text-emerald-50",
    pillClass: "bg-emerald-400/25 text-emerald-100 border-emerald-300/40",
    highlights: [
      "Chia nhỏ 3–5 bước kiến thức ngắn dễ nhớ",
      "Tự động lưu vị trí bước đang học dở (US-11)",
      "Kết nối trực tiếp với tình huống thực tế cuối bài",
    ],
  },
  {
    id: "slide-scenarios",
    tag: "Chủ đề 02 · Tình huống Tương tác & Ranh giới An toàn",
    title: "Thực hành nói 'Không' & Bảo vệ ranh giới cá nhân",
    subtitle:
      "Học sinh trực tiếp đưa ra lựa chọn trước các tình huống đời thực: bị trêu chọc ngoại hình, lời đề nghị giữ bí mật xấu hay tin nhắn lạ trên mạng.",
    badgeText: "+30 XP & +20 Điểm thưởng mỗi tình huống xử lý tốt",
    ctaLabel: "Thử sức Giải quyết Tình huống",
    ctaHref: "/scenarios",
    bgClass: "from-amber-500 via-orange-500 to-rose-600",
    accentClass: "bg-white/15 border-white/25 text-white",
    pillClass: "bg-amber-300/25 text-amber-50 border-amber-200/40",
    highlights: [
      "Phản hồi giải thích tức thì cho từng phương án chọn",
      "Không phán xét — cho phép làm lại để hiểu sâu kỹ năng",
      "Bảo mật tuyệt đối lựa chọn riêng lẻ của học sinh (NFR-S06)",
    ],
  },
  {
    id: "slide-avatar-gendio",
    tag: "Chủ đề 03 · Gamification 2D Avatar & Trợ lý Gendio",
    title: "Tích điểm đổi đồ Avatar 2D & Hỏi đáp kín đáo cùng Gendio",
    subtitle:
      "Duy trì chuỗi ngày học (Learning Streak 3–7–14 ngày), mở khóa trang phục trong Avatar Studio và trò chuyện riêng tư không sợ bị đánh giá.",
    badgeText: "Cửa hàng Avatar 2D & Hỏi đáp Gendio 24/7",
    ctaLabel: "Mở Phòng thay đồ Avatar 2D",
    ctaHref: "/avatar",
    bgClass: "from-sky-600 via-indigo-600 to-violet-700",
    accentClass: "bg-sky-400/20 border-sky-200/30 text-sky-50",
    pillClass: "bg-sky-300/25 text-sky-100 border-sky-200/40",
    highlights: [
      "Tùy chỉnh kiểu tóc, trang phục, phụ kiện trực tiếp",
      "3 Nhiệm vụ mỗi ngày tặng thêm XP & Điểm thưởng",
      "Trợ lý Gendio giải đáp tâm sinh lý chuẩn khoa học",
    ],
  },
  {
    id: "slide-parent",
    tag: "Chủ đề 04 · Góc Phụ huynh & Tôn trọng Quyền riêng tư",
    title: "Đồng hành cùng con tuổi dậy thì mà không xâm phạm riêng tư",
    subtitle:
      "Phụ huynh nhận báo cáo tổng hợp 7/14/30 ngày và gợi ý mở lời trò chuyện tự nhiên cùng con, trong khi nội dung chat của trẻ được bảo mật.",
    badgeText: "Tuân thủ chuẩn bảo mật riêng tư NFR-S06",
    ctaLabel: "Trải nghiệm Góc Phụ huynh",
    ctaHref: "/parent",
    bgClass: "from-teal-700 via-emerald-700 to-slate-800",
    accentClass: "bg-teal-400/20 border-teal-200/30 text-teal-50",
    pillClass: "bg-teal-300/25 text-teal-100 border-teal-200/40",
    highlights: [
      "Xem số bài hoàn thành, chuỗi Streak & chủ đề con quan tâm",
      "Hộp thư báo cáo định kỳ & gợi ý câu chuyện gia đình",
      "Bộ đếm thông minh 15 phút học miễn phí mỗi ngày (US-30)",
    ],
  },
];

const TOPIC_STYLES: Record<
  string,
  {
    badgeBg: string;
    cardBorder: string;
    iconBg: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Puberty: {
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cardBorder: "hover:border-emerald-400",
    iconBg: "bg-emerald-500 text-white",
    label: "Cơ thể & Dậy thì",
    icon: Sparkles,
  },
  Boundaries: {
    badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
    cardBorder: "hover:border-rose-400",
    iconBg: "bg-rose-500 text-white",
    label: "Ranh giới & Đồng thuận",
    icon: ShieldCheck,
  },
  Emotion: {
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    cardBorder: "hover:border-amber-400",
    iconBg: "bg-amber-500 text-white",
    label: "Cảm xúc & Tình bạn",
    icon: HeartHandshake,
  },
  CyberSafety: {
    badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
    cardBorder: "hover:border-sky-400",
    iconBg: "bg-sky-500 text-white",
    label: "An toàn trên mạng",
    icon: ShieldAlert,
  },
};

export default function LandingPage() {
  const { profile, modules } = useGenUp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[activeSlide];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] text-foreground flex flex-col">
      {/* Header rực rỡ, thân thiện */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                GenUp
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                THCS 11–15 tuổi
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Lớn lên tự tin, an toàn mỗi ngày
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <GoogleSignInButton />
          <Link
            href="/login"
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium hidden sm:flex items-center"
          >
            Chọn khu vực
          </Link>
          <Link
            href="/dashboard"
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Vào học ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* HERO CAROUSEL ĐA SẮC MÀU */}
        <section
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentSlide.bgClass} text-white p-6 sm:p-10 shadow-md transition-colors duration-500`}
        >
          {/* Họa tiết trang trí nền nhẹ */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Cột trái: Nội dung Slide hiện tại */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentSlide.pillClass}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentSlide.tag}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/20 text-white/90">
                  Slide {activeSlide + 1} / {HERO_SLIDES.length}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                {currentSlide.subtitle}
              </p>

              {/* Danh sách điểm nổi bật của Slide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {currentSlide.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border backdrop-blur-sm text-xs font-medium leading-snug flex items-start gap-2 ${currentSlide.accentClass}`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Cụm nút hành động */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href={currentSlide.ctaHref}
                  className="h-11 px-5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <span>{currentSlide.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="h-11 px-4 rounded-xl bg-black/25 hover:bg-black/35 border border-white/25 text-white text-sm font-semibold inline-flex items-center gap-2"
                >
                  <span>Tiếp tục hồ sơ ({profile.nickname})</span>
                </Link>

                <Link
                  href="/parent"
                  className="h-11 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-medium inline-flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Góc Phụ Huynh</span>
                </Link>
              </div>
            </div>

            {/* Cột phải: Thẻ Preview Nhân vật 2D & Trạng thái Học tập trực quan */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 text-slate-900 rounded-2xl p-5 shadow-lg border border-white/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <Avatar2D
                        gender={profile.avatarGender}
                        hairId={profile.equippedHairId}
                        outfitId={profile.equippedOutfitId}
                        accessoryId={profile.equippedAccessoryId}
                        size={52}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Hồ sơ Học sinh
                      </span>
                      <h2 className="text-base font-bold text-slate-900 mt-0.5">
                        {profile.nickname} · Lớp {profile.grade}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {currentSlide.badgeText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 chỉ số Gamification có màu sắc rõ ràng */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[11px] font-medium text-emerald-700">
                      Điểm Kinh Nghiệm
                    </p>
                    <p className="text-base font-bold text-emerald-900 tabular-nums mt-0.5">
                      {profile.totalXp} XP
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-[11px] font-medium text-amber-800 flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Streak
                    </p>
                    <p className="text-base font-bold text-amber-900 tabular-nums mt-0.5">
                      {profile.currentStreak} ngày
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                    <p className="text-[11px] font-medium text-sky-700">
                      Ví Đổi Đồ
                    </p>
                    <p className="text-base font-bold text-sky-900 tabular-nums mt-0.5">
                      {profile.rewardPoints} Điểm
                    </p>
                  </div>
                </div>

                {/* Kiến trúc Cloud đồng bộ */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Xác thực & Hồ sơ
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Google Firebase + Supabase
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Chat Gendio & Hộp thư
                    </span>
                    <span className="font-semibold text-indigo-700">
                      MongoDB Atlas
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Thông báo Mobile/Web
                    </span>
                    <span className="font-semibold text-amber-700">
                      Firebase Cloud Messaging
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thanh điều khiển Carousel (Dots + Nút Trái/Phải) */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Chuyển tới slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeSlide
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Slide trước"
                className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/35 border border-white/25 flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Slide tiếp theo"
                className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/35 border border-white/25 flex items-center justify-center text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 4 CHỦ ĐỀ HỌC TẬP CÓ MÀU SẮC RIÊNG BIỆT */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Chương trình chuẩn THCS (Lớp 6 – Lớp 9)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                4 Chủ đề Kỹ năng & Giáo dục Giới tính Cốt lõi
              </h2>
            </div>
            <Link
              href="/lessons"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>Xem toàn bộ Thư viện bài học</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod) => {
              const style = TOPIC_STYLES[mod.topicCategory] || TOPIC_STYLES.Puberty;
              const TopicIcon = style.icon;
              return (
                <Link
                  key={mod.id}
                  href={`/lessons/${mod.id}`}
                  className={`group bg-white border border-slate-200 ${style.cardBorder} rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}
                      >
                        <TopicIcon className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.badgeBg}`}
                      >
                        {style.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {mod.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium tabular-nums">
                      {mod.estimatedMinutes} phút · +{mod.xpReward} XP
                    </span>
                    <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                      Học ngay <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4 TRỤ CỘT TÍNH NĂNG ĐẶC BIỆT */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-emerald-950">
              Bài học chia bước trực quan
            </h3>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Không nhồi nhét chữ — mỗi bài chia thành các thẻ kiến thức ngắn kèm tự động lưu bước đang đọc.
            </p>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-amber-950">
              Chuỗi Streak & Shop Avatar 2D
            </h3>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Nhận thưởng cột mốc 3, 7, 14 ngày học liên tiếp và tự tay phối đồ cho nhân vật 2D.
            </p>
          </div>

          <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-sky-950">
              Trợ lý Gendio Kín đáo
            </h3>
            <p className="text-xs text-sky-900/80 leading-relaxed">
              Giải đáp thắc mắc tuổi mới lớn an toàn; cuộc trò chuyện riêng của con không bị lộ cho phụ huynh.
            </p>
          </div>

          <div className="bg-violet-50/80 border border-violet-200 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-violet-950">
              Smart Timer & Báo cáo Gia đình
            </h3>
            <p className="text-xs text-violet-900/80 leading-relaxed">
              Miễn phí 15 phút học tương tác mỗi ngày; tự động tạm dừng khi ẩn tab hoặc nghỉ quá 60 giây.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
