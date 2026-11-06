// Service Worker cho Firebase Cloud Messaging (Web Push & Mobile PWA)
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      notification: {
        title: "GenUp — Thông báo học tập",
        body: event.data ? event.data.text() : "Bạn có thông báo mới từ GenUp!",
      },
    };
  }

  const notification = payload.notification || {};
  const title = notification.title || "GenUp — Lớn lên tự tin mỗi ngày";
  const options = {
    body: notification.body || "Bạn có cập nhật mới trong hành trình học tập!",
    data: payload.data || { actionUrl: "/notifications" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl =
    (event.notification.data && event.notification.data.actionUrl) ||
    "/notifications";
  event.waitUntil(self.clients.openWindow(targetUrl));
});

