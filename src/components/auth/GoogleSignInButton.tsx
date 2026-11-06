"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import {
  FirebaseAuthUser,
  signInWithGoogleFirebase,
  signOutFirebase,
} from "@/lib/firebase/client";

export function GoogleSignInButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { profile, updateProfile } = useGenUp();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncUserFromStorage = () => {
      try {
        const raw = localStorage.getItem("genup_firebase_user");
        setUser(raw ? (JSON.parse(raw) as FirebaseAuthUser) : null);
      } catch {
        setUser(null);
      }
    };
    syncUserFromStorage();
    window.addEventListener("genup-auth-change", syncUserFromStorage);
    return () => window.removeEventListener("genup-auth-change", syncUserFromStorage);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const res = await signInWithGoogleFirebase();
    setLoading(false);
    if (res.ok && res.user) {
      setUser(res.user);
      if (res.user.displayName && profile.nickname === "Minh Anh") {
        updateProfile({ nickname: res.user.displayName });
      }
      window.dispatchEvent(new Event("genup-auth-change"));
      router.push("/dashboard");
    } else if (res.error) {
      alert(res.error);
    }
  };

  const handleLogout = async () => {
    await signOutFirebase();
    try {
      localStorage.removeItem("genup_supabase_logged_in");
    } catch {
      // ignore
    }
    setUser(null);
    window.dispatchEvent(new Event("genup-auth-change"));
    router.replace("/login");
  };

  if (user) {
    return (
      <div className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg border border-border-strong bg-background text-xs">
        <span className="font-medium truncate max-w-[140px]">
          {user.displayName || user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          title="Đăng xuất Google"
          className="text-muted hover:text-foreground inline-flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thoát</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={loading}
      className={`${
        compact ? "h-8 px-3 rounded-lg text-xs" : "h-10 px-4 rounded-xl text-sm"
      } border border-border-strong bg-surface hover:bg-button-hover text-foreground font-medium inline-flex items-center gap-2 disabled:opacity-50`}
    >
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
      <span>{loading ? "Đang kết nối..." : "Đăng nhập Google"}</span>
    </button>
  );
}
