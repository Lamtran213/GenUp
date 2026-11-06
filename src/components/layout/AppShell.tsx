"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  BookOpen,
  Clock,
  Compass,
  Flame,
  LayoutDashboard,
  Lock,
  Mail,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { Avatar2D } from "@/components/avatar/Avatar2D";

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    profile,
    parentSettings,
    parentInbox,
    notifications,
    remainingFreeSeconds,
    isTimerRunning,
  } = useGenUp();

  // Không bọc sidebar cho trang Landing (/) hoặc trang Login/Onboarding
  const isStandalonePage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/onboarding" ||
    pathname === "/choose-avatar";

  if (isStandalonePage) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  const isParentZone = pathname.startsWith("/parent");
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const unreadInbox = parentInbox.filter((m) => !m.isRead).length;

  const studentNav = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/lessons", label: "Thư viện bài học", icon: BookOpen },
    { href: "/scenarios", label: "Tình huống", icon: Compass },
    { href: "/progress", label: "Tiến độ & Streak", icon: TrendingUp },
    { href: "/rewards", label: "Nhiệm vụ & Shop", icon: Award },
    { href: "/avatar", label: "Avatar Studio", icon: Sparkles },
    { href: "/chat", label: "Hỏi Gendio", icon: MessageCircle },
    {
      href: "/notifications",
      label: "Thông báo",
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    { href: "/settings", label: "Cài đặt hồ sơ", icon: Settings },
  ];

  const parentNav = [
    { href: "/parent", label: "Parent Dashboard", icon: ShieldCheck },
    {
      href: "/parent/inbox",
      label: "Hộp thư báo cáo",
      icon: Mail,
      badge: unreadInbox > 0 ? unreadInbox : undefined,
    },
    { href: "/parent/email-settings", label: "Cấu hình Email", icon: Settings },
    { href: "/parent/gendio", label: "Gendio Phụ huynh", icon: MessageCircle },
    { href: "/parent/support", label: "Hỗ trợ & FAQ", icon: BookOpen },
    { href: "/premium", label: "Gói Premium", icon: Sparkles },
  ];

  const activeNav = isParentZone ? parentNav : studentNav;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar trên Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-surface border-r border-border-strong z-20">
        <div className="h-16 px-5 flex items-center justify-between border-b border-border-strong">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              G
            </span>
            <div>
              <span className="font-semibold text-base tracking-tight block leading-none">
                GenUp
              </span>
              <span className="text-xs text-muted">
                {isParentZone ? "Góc Phụ Huynh" : `Học sinh · Lớp ${profile.grade}`}
              </span>
            </div>
          </Link>
        </div>

        {/* Chuyển nhanh khu vực Học sinh <-> Phụ huynh theo Mục 4.2 SRS */}
        <div className="p-3 border-b border-border">
          <div
            className="grid grid-cols-2 p-1 rounded-xl bg-background"
            style={{ boxShadow: "var(--shadow-segment-track)" }}
          >
            <Link
              href="/dashboard"
              className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors ${
                !isParentZone
                  ? "bg-surface text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
              style={!isParentZone ? { boxShadow: "var(--shadow-segment-thumb)" } : undefined}
            >
              Khu Học tập
            </Link>
            <Link
              href="/parent"
              className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors ${
                isParentZone
                  ? "bg-surface text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
              style={isParentZone ? { boxShadow: "var(--shadow-segment-thumb)" } : undefined}
            >
              Góc Phụ huynh
            </Link>
          </div>
        </div>

        {/* Danh sách điều hướng */}
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
                className={`h-10 px-3 rounded-xl flex items-center justify-between text-sm transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted hover:bg-item-hover hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-background text-foreground tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Thẻ tóm tắt Hồ sơ & Bộ đếm 15 phút Free ở chân Sidebar */}
        <div className="p-3 border-t border-border-strong space-y-2.5">
          <div className="p-2.5 rounded-xl bg-background flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 text-muted shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted truncate">
                  {parentSettings.planType === "Free"
                    ? "Thời lượng Free hôm nay"
                    : "Gói Premium Đang bật"}
                </p>
                <p className="text-xs font-semibold tabular-nums">
                  {parentSettings.planType === "Free"
                    ? `${formatSeconds(remainingFreeSeconds)} / 15:00`
                    : "Không giới hạn"}
                </p>
              </div>
            </div>
            <Link
              href="/premium"
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border-strong hover:bg-button-hover shrink-0"
            >
              {parentSettings.planType === "Free" ? "Nâng cấp" : "Quản lý"}
            </Link>
          </div>

          <div className="flex items-center gap-2.5 px-1">
            <Avatar2D
              gender={profile.avatarGender}
              hairId={profile.equippedHairId}
              outfitId={profile.equippedOutfitId}
              accessoryId={profile.equippedAccessoryId}
              size={36}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{profile.nickname}</p>
              <p className="text-xs text-muted tabular-nums">
                {profile.totalXp} XP · {profile.currentStreak} ngày Streak
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Khung chính */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Header dính đầu trang */}
        <header className="h-14 px-4 lg:px-8 bg-surface border-b border-border-strong sticky top-0 z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                G
              </span>
              <span className="font-semibold text-sm">GenUp</span>
            </Link>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted">
              <UserCheck className="w-3.5 h-3.5" />
              {isParentZone
                ? "Chế độ đồng hành gia đình (Tuân thủ bảo mật riêng tư NFR-S06)"
                : "Không gian học tập an toàn dành cho học sinh THCS (11–15 tuổi)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Chỉ báo Smart Timer 15 phút Free */}
            <div
              className="h-8 px-2.5 rounded-lg bg-background flex items-center gap-1.5 text-xs tabular-nums"
              title="Bộ đếm tự động tạm dừng khi ẩn tab hoặc không tương tác quá 60 giây (US-31)"
            >
              <Clock className="w-3.5 h-3.5 text-muted" />
              <span className="font-medium">
                {parentSettings.planType === "Free"
                  ? formatSeconds(remainingFreeSeconds)
                  : "Premium"}
              </span>
              {parentSettings.planType === "Free" && (
                <span className="text-muted hidden sm:inline">
                  {isTimerRunning ? "(Đang tính giờ)" : "(Tạm dừng)"}
                </span>
              )}
            </div>

            <div className="h-8 px-2.5 rounded-lg bg-background flex items-center gap-1 text-xs font-medium tabular-nums">
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              <span>{profile.currentStreak} ngày</span>
            </div>

            <Link
              href={isParentZone ? "/dashboard" : "/parent"}
              className="h-8 px-3 rounded-lg border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-muted" />
              <span>{isParentZone ? "Về Khu Học sinh" : "Góc Phụ huynh"}</span>
            </Link>
          </div>
        </header>

        {/* Nội dung màn hình */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Thanh điều hướng dưới cùng trên Mobile (NFR-C02, NFR-C05: nút >= 44x44px) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border-strong z-20 grid grid-cols-5 h-16 px-1">
        {(isParentZone
          ? [
              { href: "/parent", label: "Tổng quan", icon: ShieldCheck },
              { href: "/parent/inbox", label: "Hộp thư", icon: Mail },
              { href: "/parent/email-settings", label: "Email", icon: Settings },
              { href: "/parent/gendio", label: "Gendio", icon: MessageCircle },
              { href: "/premium", label: "Premium", icon: Sparkles },
            ]
          : [
              { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
              { href: "/lessons", label: "Bài học", icon: BookOpen },
              { href: "/scenarios", label: "Tình huống", icon: Compass },
              { href: "/rewards", label: "Thưởng", icon: Award },
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
                isActive ? "text-foreground font-semibold" : "text-muted"
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

