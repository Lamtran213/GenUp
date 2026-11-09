import { PermissionsAndroid, Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import { registerFcmDevice } from "./api";

export async function enablePush(firebaseUid: string, sendWelcomePush = true) {
  if (Platform.OS === "android" && Number(Platform.Version) >= 33) {
    const r = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (r !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error("Bạn chưa cho phép GenUp gửi thông báo.");
    }
  }

  const messaging = getMessaging(getApp());
  const status = await requestPermission(messaging);
  if (
    status !== AuthorizationStatus.AUTHORIZED &&
    status !== AuthorizationStatus.PROVISIONAL
  ) {
    throw new Error("Quyền thông báo bị từ chối.");
  }

  const fcmToken = await getToken(messaging);
  await registerFcmDevice({
    fcmToken,
    firebaseUid,
    deviceName: `Android ${Platform.Version} (React Native)`,
    sendWelcomePush,
  });
  return fcmToken;
}

// Thông báo khi app đang mở (foreground)
export function listenForeground(cb: (title: string, body: string) => void) {
  return onMessage(getMessaging(getApp()), (msg) => {
    cb(msg.notification?.title ?? "GenUp", msg.notification?.body ?? "");
  });
}

