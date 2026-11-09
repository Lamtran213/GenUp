import Constants from "expo-constants";

export const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) || "https://genup-beta.vercel.app";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export type GenUpUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};

// Dùng lại đúng API web: POST /api/auth/firebase (đồng bộ Supabase + MongoDB)
export function syncFirebaseLogin(idToken: string) {
  return post<{ ok: boolean; user: GenUpUser }>("/api/auth/firebase", { idToken });
}

// Dùng lại đúng API web: POST /api/fcm/device
export function registerFcmDevice(args: {
  fcmToken: string;
  firebaseUid: string;
  deviceName: string;
  sendWelcomePush?: boolean;
}) {
  return post<{ ok: boolean }>("/api/fcm/device", { ...args, platform: "android" });
}

export function askGendio(message: string) {
  return post<{ reply?: { text?: string } }>("/api/gendio", { message });
}

