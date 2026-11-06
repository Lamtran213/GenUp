import admin from "firebase-admin";

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export async function sendMobilePushNotification(params: {
  tokens: string[];
  title: string;
  body: string;
  actionUrl?: string;
}): Promise<{ sentCount: number; simulated: boolean }> {
  const app = getFirebaseAdminApp();
  if (!app || params.tokens.length === 0) {
    // ponytail: trả về simulated=true khi chưa cấu hình chứng chỉ Firebase Admin hoặc chưa có thiết bị đăng ký token
    return { sentCount: 0, simulated: true };
  }

  const response = await admin.messaging(app).sendEachForMulticast({
    tokens: params.tokens,
    notification: {
      title: params.title,
      body: params.body,
    },
    data: {
      actionUrl: params.actionUrl || "/dashboard",
    },
  });

  return {
    sentCount: response.successCount,
    simulated: false,
  };
}

export async function verifyFirebaseIdToken(idToken: string) {
  const app = getFirebaseAdminApp();
  if (!app) {
    throw new Error("Chưa cấu hình Firebase Admin SDK trên server.");
  }
  return admin.auth(app).verifyIdToken(idToken);
}


