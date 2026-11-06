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

    // Xác thực ID Token phía Server bằng Firebase Admin SDK & đồng bộ vào Supabase + MongoDB
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

export async function showBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, {
          body,
          data: { actionUrl: "/notifications" },
        });
        return;
      }
    }
    new Notification(title, { body });
  } catch {
    // ignore
  }
}

export async function registerFirebasePushToken(): Promise<{
  ok: boolean;
  token: string | null;
  mode?: "fcm-cloud" | "web-service-worker";
  message: string;
}> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return {
      ok: false,
      token: null,
      message: "Trình duyệt hiện tại không hỗ trợ Web Notification API.",
    };
  }

  // 1. Xin quyền hiển thị Notification của trình duyệt (Chrome / Brave / Edge / Mobile PWA)
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return {
      ok: false,
      token: null,
      message:
        "Quyền thông báo đang bị chặn (Denied). Hãy bấm vào biểu tượng ổ khóa / cài đặt cạnh thanh địa chỉ trình duyệt và chuyển Notifications sang 'Allow' (Cho phép).",
    };
  }

  // 2. Đăng ký Service Worker (/firebase-messaging-sw.js)
  let swReg: ServiceWorkerRegistration | undefined;
  if ("serviceWorker" in navigator) {
    swReg = await navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .catch(() => undefined);
  }

  let fcmToken: string | null = null;
  let mode: "fcm-cloud" | "web-service-worker" = "fcm-cloud";

  const app = getFirebaseClientApp();
  const rawVapid = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  const validVapidKey =
    rawVapid && rawVapid !== "your-web-push-vapid-key" && rawVapid.length > 20
      ? rawVapid
      : undefined;

  if (app) {
    const supported = await isSupported().catch(() => false);
    if (supported) {
      try {
        const messaging = getMessaging(app);
        fcmToken = await getToken(messaging, {
          ...(swReg ? { serviceWorkerRegistration: swReg } : {}),
          ...(validVapidKey ? { vapidKey: validVapidKey } : {}),
        });
      } catch {
        // Lưu ý: Trình duyệt Brave mặc định tắt "Use Google services for push messaging"
        // nên getToken của Google FCM sẽ bị chặn nếu chưa bật trong brave://settings/privacy.
        fcmToken = null;
      }
    }
  }

  // Fallback sang Service Worker Web Notification nếu dùng Brave hoặc chưa cấu hình VAPID Key
  if (!fcmToken) {
    mode = "web-service-worker";
    const savedLocalToken = localStorage.getItem("genup_fcm_device_token");
    fcmToken =
      savedLocalToken ||
      `fcm-browser-local-${Math.random().toString(36).slice(2, 12)}`;
  }

  try {
    localStorage.setItem("genup_fcm_device_token", fcmToken);
  } catch {
    // ignore
  }

  // 3. Lưu token thiết bị lên Backend (MongoDB fcm_devices + Supabase public.user_devices)
  let firebaseUid = "anonymous";
  try {
    const rawUser = localStorage.getItem("genup_firebase_user");
    if (rawUser) {
      firebaseUid = (JSON.parse(rawUser) as FirebaseAuthUser).uid || "anonymous";
    }
  } catch {
    // ignore
  }

  await fetch("/api/fcm/device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fcmToken,
      platform: "web",
      firebaseUid,
      deviceName: navigator.userAgent.includes("Mobile")
        ? "Mobile Web PWA"
        : "Desktop Browser",
      sendWelcomePush: mode === "fcm-cloud",
    }),
  }).catch(() => null);

  // Hiển thị ngay thông báo hệ thống xác nhận đã bật thành công
  await showBrowserNotification(
    "GenUp Push Notification đã bật!",
    "Bạn sẽ nhận được lời nhắc duy trì chuỗi Streak và thông báo huy hiệu mới mỗi ngày."
  );

  return {
    ok: true,
    token: fcmToken,
    mode,
    message:
      mode === "fcm-cloud"
        ? `Đã kết nối Firebase Cloud Messaging thành công (Token: ${fcmToken.slice(0, 20)}...) và lưu vào Supabase & MongoDB!`
        : `Đã bật quyền Push Notification trên trình duyệt & đăng ký thiết bị (${fcmToken}) vào Supabase & MongoDB! (Mẹo: Nếu dùng trình duyệt Brave và muốn nhận token FCM trực tiếp từ máy chủ Google, hãy bật 'Use Google services for push messaging' trong brave://settings/privacy).`,
  };
}
