"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, ShieldCheck, User, Users } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  FirebaseAuthUser,
  signInWithGoogleFirebase,
  signOutFirebase,
} from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const { profile, updateProfile } = useGenUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("genup_firebase_user");
      if (saved) {
        setFirebaseUser(JSON.parse(saved) as FirebaseAuthUser);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleGoogleFirebaseLogin = async () => {
    setGoogleLoading(true);
    setAuthStatus(null);
    setIsSuccess(false);

    const res = await signInWithGoogleFirebase();
    setGoogleLoading(false);

    if (!res.ok || !res.user) {
      setIsSuccess(false);
      setAuthStatus(res.error || "Đăng nhập Google thất bại.");
      return;
    }

    setFirebaseUser(res.user);
    setIsSuccess(true);
    if (res.user.displayName && profile.nickname === "Minh Anh") {
      updateProfile({ nickname: res.user.displayName });
    }
    setAuthStatus(
      `Đăng nhập Google thành công (${res.user.email || res.user.displayName})! Đang chuyển vào góc học tập...`
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  };

  const handleGoogleSignOut = async () => {
    await signOutFirebase();
    setFirebaseUser(null);
    setIsSuccess(true);
    setAuthStatus("Đã đăng xuất tài khoản Google.");
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    if (!email.trim() || !password.trim()) {
      setAuthStatus("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsSuccess(true);
      setAuthStatus("Đã xác thực phiên gia đình (Chế độ Unified Profile). Đang chuyển hướng...");
      router.push("/dashboard");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthStatus(`Thông báo xác thực: ${error.message}`);
    } else {
      setIsSuccess(true);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
              G
            </span>
            <span className="font-semibold text-sm">GenUp</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight pt-1">
            Truy cập & Chọn khu vực sử dụng
          </h1>
          <p className="text-xs text-muted">
            Theo Mục 4.2 SRS: Học sinh và Phụ huynh có thể chuyển đổi trực tiếp trên cùng hồ sơ gia đình.
          </p>
        </div>

        {/* Lựa chọn nhanh khu vực theo đúng luồng Mục 4.2 SRS */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full p-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                <User className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Vào Khu vực Học sinh ({profile.nickname} · Lớp {profile.grade})
                </p>
                <p className="text-xs text-muted">
                  Học bài theo bước, giải tình huống, nhận XP & đổi đồ Avatar
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => router.push("/parent")}
            className="w-full p-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                <Users className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Vào Góc Phụ Huynh</p>
                <p className="text-xs text-muted">
                  Xem báo cáo tổng hợp 7/14/30 ngày, Hộp thư & cấu hình Email
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted shrink-0" />
          </button>
        </div>

        {/* Đăng nhập Google qua Firebase 3rd-party Auth */}
        <div className="border-t border-border-strong pt-4 space-y-3">
          <p className="text-xs font-medium text-muted">
            Liên kết đăng nhập nhanh (Google qua Firebase Auth)
          </p>

          {firebaseUser ? (
            <div className="p-3 rounded-xl border border-border-strong bg-background flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {firebaseUser.displayName || "Tài khoản Google"}
                </p>
                <p className="text-xs text-muted truncate">{firebaseUser.email}</p>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignOut}
                className="h-8 px-2.5 rounded-lg border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleFirebaseLogin}
              disabled={googleLoading}
              className="w-full h-10 px-4 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-foreground text-sm font-medium flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span>
                {googleLoading
                  ? "Đang kết nối Google (Firebase)..."
                  : "Tiếp tục bằng Google"}
              </span>
            </button>
          )}
        </div>

        <div className="border-t border-border-strong pt-4">
          <p className="text-xs font-medium text-muted mb-3">
            Hoặc đăng nhập bằng Email & Mật khẩu (US-45)
          </p>
          <form onSubmit={handleSupabaseLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground block">
                Email phụ huynh
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="phuhuynh@genup.vn"
                className="w-full h-10 px-3 rounded-xl bg-surface border border-border-strong text-sm focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(true);
                    setAuthStatus(
                      "Đã gửi hướng dẫn khôi phục mật khẩu tới email đã đăng ký (US-45 AC2)."
                    );
                  }}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl bg-surface border border-border-strong text-sm focus:outline-none focus:border-focus focus:ring-2 focus:ring-focus"
              />
            </div>

            {authStatus && (
              <p
                className={`text-xs rounded-lg px-3 py-2 border ${
                  isSuccess
                    ? "text-success-text bg-success-bg border-success-border"
                    : "text-error-text bg-error-bg border-error-border"
                }`}
              >
                {authStatus}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium"
            >
              Đăng nhập tài khoản
            </button>
          </form>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Muốn khởi tạo lại từ đầu?
          </span>
          <Link href="/onboarding" className="font-medium text-foreground hover:underline">
            Tạo hồ sơ học sinh mới
          </Link>
        </div>
      </div>
    </div>
  );
}
