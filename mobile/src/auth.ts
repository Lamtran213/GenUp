import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as fbSignOut,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { syncFirebaseLogin, GenUpUser } from "./api";

// Web Client ID (OAuth client type 3) của Firebase project genup-9c6c3.
// Lấy trong google-services.json -> oauth_client[client_type=3].client_id
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  "533072527976-5d64am0pml634sqbcpe7l4fumabtl98e.apps.googleusercontent.com";

GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });

export async function signInWithGoogle(): Promise<GenUpUser> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const res = await GoogleSignin.signIn();
  if (!isSuccessResponse(res) || !res.data.idToken) {
    throw new Error("Đã huỷ đăng nhập Google.");
  }

  const auth = getAuth(getApp());
  const cred = GoogleAuthProvider.credential(res.data.idToken);
  const { user } = await signInWithCredential(auth, cred);
  const firebaseIdToken = await user.getIdToken();

  // Đồng bộ về backend Next.js (Supabase + MongoDB) như bản web
  const synced = await syncFirebaseLogin(firebaseIdToken);
  return synced.user;
}

export async function signOut() {
  await GoogleSignin.signOut().catch(() => null);
  await fbSignOut(getAuth(getApp())).catch(() => null);
}

export function currentFirebaseUser() {
  return getAuth(getApp()).currentUser;
}

