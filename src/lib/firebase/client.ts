"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !projectId || !messagingSenderId || !appId) {
    return null;
  }

  return getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: `${projectId}.firebasestorage.app`,
        messagingSenderId,
        appId,
      });
}

export async function signInWithGoogleFirebase(): Promise<{
  ok: boolean;
  user?: FirebaseAuthUser;
  error?: string;
}> {
  const app = getFirebaseClientApp();
  if (!app) {
    return {
      ok: false,
      error: "Chưa cấu hình NEXT_PUBLIC_FIREBASE_* trong .env.local",
    };
  }

  try {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();

    // Xác thực ID Token phía Server bằng Firebase Admin SDK & đồng bộ vào MongoDB
    const res = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: data.error || "Xác thực token với máy chủ thất bại.",
      };
    }

    const authUser: FirebaseAuthUser = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
    };

    try {
      localStorage.setItem("genup_firebase_user", JSON.stringify(authUser));
    } catch {
      // ignore storage quota errors
    }

    return { ok: true, user: authUser };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || "";
    if (code === "auth/popup-closed-by-user") {
      return { ok: false, error: "Bạn đã đóng cửa sổ đăng nhập Google." };
    }
    if (code === "auth/operation-not-allowed") {
      return {
        ok: false,
        error:
          "Bạn chưa bật phương thức đăng nhập Google trên Firebase Console (Authentication → Sign-in method → Google → Enable).",
      };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lỗi đăng nhập Google qua Firebase.",
    };
  }
}

export async function signOutFirebase(): Promise<void> {
  const app = getFirebaseClientApp();
  if (app) {
    const auth = getAuth(app);
    await signOut(auth).catch(() => null);
  }
  try {
    localStorage.removeItem("genup_firebase_user");
  } catch {
    // ignore
  }
  await fetch("/api/auth/firebase", { method: "DELETE" }).catch(() => null);
}

export async function registerFirebasePushToken(): Promise<string | null> {
  const app = getFirebaseClientApp();
  if (!app) {
    return "fcm-demo-token-local-device";
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey }).catch(() => null);
  return token;
}
