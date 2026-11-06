"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  Bell,
  BookOpen,
  Clock,
  Compass,
  Flame,
  Gem,
  LayoutDashboard,
  Lock,
  Mail,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { Avatar2D } from "@/components/avatar/Avatar2D";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    profile,
    parentSettings,
    parentInbox,
    notifications,
    remainingFreeSeconds,
    isTimerRunning,
  } = useGenUp();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isPublicPage = pathname === "/" || pathname === "/login";

  useEffect(() => {
    const checkAuth = () => {
      try {
        const fbUser = localStorage.getItem("genup_firebase_user");
        const sbLogged = localStorage.getItem("genup_supabase_logged_in");
        const authed = Boolean(fbUser || sbLogged);
        setIsAuthenticated(authed);
        setAuthChecked(true);
        if (!authed && !isPublicPage) {
          router.replace("/login");
        }
      } catch {
        setIsAuthenticated(false);
        setAuthChecked(true);
        if (!isPublicPage) {
          router.replace("/login");
        }
      }
    };

    checkAuth();
    window.addEventListener("genup-auth-change", checkAuth);
    return () => window.removeEventListener("genup-auth-change", checkAuth);
  }, [isPublicPage, pathname, router]);

  const isStandalonePage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/onboarding" ||
    pathname === "/choose-avatar";

  if (!isPublicPage && (!authChecked || !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-emerald-800">
            Đang kiểm tra phiên đăng nhập...
          </p>
          <p className="text-xs text-muted">
            Vui lòng đăng nhập bằng Google để truy cập GenUp.
          </p>
        </div>
      </div>
    );
  }

  if (isStandalonePage) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  const isParentZone = pathname.startsWith("/parent");
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const unreadInbox = parentInbox.filter((m) => !m.isRead).length;

  // Tính Level & phần trăm XP theo phong cách Edu Gamification (Mỗi 100 XP lên 1 Level)
  const currentLevel = Math.floor(profile.totalXp / 100) + 1;
  const xpInCurrentLevel = profile.totalXp % 100;

  const studentNav = [
    { href: "/dashboard", label: "Bản đồ Học tập", icon: LayoutDashboard, color: "text-emerald-600" },
    { href: "/lessons", label: "Thư viện Bài học", icon: BookOpen, color: "text-teal-600" },
    { href: "/scenarios", label: "Đấu trường Tình huống", icon: Compass, color: "text-amber-600" },
    { href: "/progress", label: "Hành trình & Streak", icon: TrendingUp, color: "text-orange-600" },
    { href: "/rewards", label: "Nhiệm vụ & Cửa hàng", icon: Award, color: "text-rose-600" },
    { href: "/avatar", label: "Phòng thay đồ 2D", icon: Sparkles, color: "text-violet-600" },
    { href: "/chat", label: "Hỏi Trợ lý Gendio", icon: MessageCircle, color: "text-sky-600" },
    {
      href: "/notifications",
      label: "Thông báo & FCM",
      icon: Bell,
      color: "text-indigo-600",
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    { href: "/settings", label: "Hồ sơ cá nhân", icon: Settings, color: "text-slate-600" },
  ];

  const parentNav = [
    { href: "/parent", label: "Parent Dashboard", icon: ShieldCheck, color: "text-emerald-600" },
    {
      href: "/parent/inbox",
      label: "Hộp thư báo cáo",
      icon: Mail,
      color: "text-amber-600",
      badge: unreadInbox > 0 ? unreadInbox : undefined,
    },
    { href: "/parent/email-settings", label: "Cấu hình Email", icon: Settings, color: "text-teal-600" },
    { href: "/parent/gendio", label: "Gendio Phụ huynh", icon: MessageCircle, color: "text-sky-600" },
    { href: "/parent/support", label: "Hỗ trợ & FAQ", icon: BookOpen, color: "text-indigo-600" },
    { href: "/premium", label: "Gói Premium", icon: Sparkles, color: "text-violet-600" },
  ];

  const activeNav = isParentZone ? parentNav : studentNav;

  return (
    <div className="relative min-h-screen text-foreground flex flex-col lg:flex-row">
      {/* Lớp đốm màu Aurora Ambient rực rỡ phía sau để tấm kính Liquid Glass khúc xạ ánh sáng */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-16 left-48 w-[420px] h-[420px] rounded-full bg-emerald-400/50 blur-[90px]" />
        <div className="absolute top-28 right-8 w-[400px] h-[400px] rounded-full bg-sky-400/50 blur-[95px]" />
        <div className="absolute bottom-8 left-1/3 w-[420px] h-[420px] rounded-full bg-amber-300/45 blur-[95px]" />
        <div className="absolute top-1/2 left-64 w-[320px] h-[320px] rounded-full bg-violet-400/35 blur-[90px]" />
      </div>

      {/* Sidebar Edu Gamification Liquid Glass nổi (Floating Dock) trên Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-3 lg:left-3 rounded-3xl liquid-glass-floating z-20 overflow-hidden">
        <div className="h-16 px-5 flex items-center justify-between border-b border-border-strong">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              G
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight block leading-none text-slate-900">
                  GenUp
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  EDU
                </span>
              </div>
              <span className="text-xs text-muted">
                {isParentZone ? "Góc Phụ Huynh" : `Nhà thám hiểm · Lớp ${profile.grade}`}
              </span>
            </div>
          </Link>
        </div>

        {/* Chuyển nhanh khu vực Học sinh <-> Phụ huynh */}
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
            <Link
              href="/dashboard"
              className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                !isParentZone
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-900/70 hover:text-emerald-950"
              }`}
            >
              Khu Học tập
            </Link>
            <Link
              href="/parent"
              className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                isParentZone
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-900/70 hover:text-emerald-950"
              }`}
            >
              Góc Phụ huynh
            </Link>
          </div>
        </div>

        {/* Danh sách điều hướng có icon sắc màu */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {activeNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/parent" &&
                item.href !== "/dashboard" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-10 px-3 rounded-xl flex items-center justify-between text-sm transition-all ${
                  isActive
                    ? "bg-emerald-100/90 text-emerald-950 font-semibold border border-emerald-300/80 shadow-2xs"
                    : "text-slate-600 hover:bg-emerald-50/60 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-emerald-700" : item.color
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Thẻ Player HUD & Bộ đếm 15 phút Free ở chân Sidebar */}
        <div className="p-3 border-t border-white/60 space-y-2.5 bg-white/25">
          <div className="p-2.5 rounded-xl bg-white/55 backdrop-blur-md border border-white/85 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-800 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-600 truncate">
                  {parentSettings.planType === "Free"
                    ? "Năng lượng học Free"
                    : "Gói Premium Đang bật"}
                </p>
                <p className="text-xs font-bold text-slate-900 tabular-nums">
                  {parentSettings.planType === "Free"
                    ? `${formatSeconds(remainingFreeSeconds)} / 15:00`
                    : "Không giới hạn ∞"}
                </p>
              </div>
            </div>
            <Link
              href="/premium"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-300/70 text-amber-950 hover:bg-amber-300 border border-white/80 shrink-0"
            >
              {parentSettings.planType === "Free" ? "Nâng cấp" : "VIP"}
            </Link>
          </div>

          {/* Thẻ Nhân vật & Thanh kinh nghiệm Level */}
          <div className="p-2.5 rounded-xl bg-white/55 backdrop-blur-md border border-white/85 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-xl bg-white/70 border border-white shrink-0">
                <Avatar2D
                  gender={profile.avatarGender}
                  hairId={profile.equippedHairId}
                  outfitId={profile.equippedOutfitId}
                  accessoryId={profile.equippedAccessoryId}
                  size={38}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {profile.nickname}
                  </p>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                    Lv.{currentLevel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 tabular-nums">
                  {profile.totalXp} XP · {profile.rewardPoints} Điểm
                </p>
              </div>
            </div>

            {/* Thanh tiến trình XP lên cấp */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-900">
                <span>Tiến độ lên Lv.{currentLevel + 1}</span>
                <span className="tabular-nums">{xpInCurrentLevel}/100 XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(8, xpInCurrentLevel)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Khung chính */}
      <div className="relative z-10 flex-1 lg:pl-[276px] flex flex-col min-w-0 pb-20 lg:pb-6">
        {/* Header Gamification Liquid Glass HUD nổi đầu trang */}
        <header className="h-14 mx-3 sm:mx-6 lg:mx-8 mt-3 px-4 lg:px-6 rounded-2xl liquid-glass-floating sticky top-3 z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                G
              </span>
              <span className="font-bold text-sm">GenUp</span>
            </Link>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isParentZone
                ? "Chế độ đồng hành gia đình (Bảo mật riêng tư NFR-S06)"
                : `Cấp độ ${currentLevel} · Khám phá kiến thức & kỹ năng THCS`}
            </span>
          </div>

          {/* Cụm huy hiệu HUD (Timer, XP, Điểm, Streak) */}
          <div className="flex items-center gap-2">
            {/* Huy hiệu XP */}
            <Link
              href="/progress"
              className="hidden sm:inline-flex h-8 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 items-center gap-1 text-xs font-bold tabular-nums"
              title="Tổng điểm kinh nghiệm (XP)"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
              <span>{profile.totalXp} XP</span>
            </Link>

            {/* Huy hiệu Điểm đổi đồ */}
            <Link
              href="/rewards"
              className="hidden md:inline-flex h-8 px-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 items-center gap-1 text-xs font-bold tabular-nums"
              title="Ví điểm đổi trang phục Avatar 2D"
            >
              <Gem className="w-3.5 h-3.5 text-sky-600" />
              <span>{profile.rewardPoints}</span>
            </Link>

            {/* Huy hiệu Chuỗi ngày học Streak */}
            <Link
              href="/progress"
              className="h-8 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1 text-xs font-bold tabular-nums"
              title="Chuỗi ngày học liên tiếp (Learning Streak)"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{profile.currentStreak} ngày</span>
            </Link>

            {/* Chỉ báo Smart Timer 15 phút Free */}
            <div
              className="h-8 px-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 flex items-center gap-1.5 text-xs tabular-nums"
              title="Bộ đếm tự động tạm dừng khi ẩn tab hoặc không tương tác quá 60 giây (US-31)"
            >
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-bold">
                {parentSettings.planType === "Free"
                  ? formatSeconds(remainingFreeSeconds)
                  : "VIP"}
              </span>
              {parentSettings.planType === "Free" && (
                <span className="text-teal-700 text-[11px] hidden xl:inline">
                  {isTimerRunning ? "(Đang học)" : "(Tạm dừng)"}
                </span>
              )}
            </div>

            <GoogleSignInButton compact />

            <Link
              href={isParentZone ? "/dashboard" : "/parent"}
              className="h-8 px-3 rounded-lg border border-border-strong bg-surface hover:bg-button-hover text-xs font-semibold flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-emerald-700" />
              <span className="hidden sm:inline">
                {isParentZone ? "Về Khu Học sinh" : "Góc Phụ huynh"}
              </span>
            </Link>
          </div>
        </header>

        {/* Nội dung màn hình */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Thanh điều hướng dưới cùng Liquid Glass trên Mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 liquid-glass-floating border-t border-white/80 z-20 grid grid-cols-5 h-16 px-1">
        {(isParentZone
          ? [
              { href: "/parent", label: "Tổng quan", icon: ShieldCheck },
              { href: "/parent/inbox", label: "Hộp thư", icon: Mail },
              { href: "/parent/email-settings", label: "Email", icon: Settings },
              { href: "/parent/gendio", label: "Gendio", icon: MessageCircle },
              { href: "/premium", label: "Premium", icon: Sparkles },
            ]
          : [
              { href: "/dashboard", label: "Bản đồ", icon: LayoutDashboard },
              { href: "/lessons", label: "Bài học", icon: BookOpen },
              { href: "/scenarios", label: "Tình huống", icon: Compass },
              { href: "/rewards", label: "Nhiệm vụ", icon: Award },
              { href: "/chat", label: "Gendio", icon: MessageCircle },
            ]
        ).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-emerald-700 font-bold" : "text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
