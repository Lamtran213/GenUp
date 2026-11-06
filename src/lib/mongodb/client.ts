import { Db, MongoClient } from "mongodb";
import { GendioChatMessage, InAppNotification, ParentInboxMessage } from "../types";
import { INITIAL_NOTIFICATIONS, INITIAL_PARENT_INBOX } from "../seed-data";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _inMemoryGendioMessages: GendioChatMessage[] | undefined;
  var _inMemoryParentInbox: ParentInboxMessage[] | undefined;
  var _inMemoryNotifications: InAppNotification[] | undefined;
  var _inMemoryTimerUsage: Record<string, number> | undefined;
}

export async function getMongoDatabase(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // ponytail: fallback bộ nhớ RAM khi chạy local/demo chưa cấu hình MONGODB_URI; tự động dùng MongoDB Atlas ngay khi thêm biến môi trường trên Vercel
    return null;
  }

  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 4000,
    });
    globalThis._mongoClientPromise = client.connect();
  }

  const connectedClient = await globalThis._mongoClientPromise;
  return connectedClient.db(process.env.MONGODB_DB_NAME || "genup");
}

export function getFallbackStore() {
  if (!globalThis._inMemoryGendioMessages) {
    globalThis._inMemoryGendioMessages = [
      {
        id: "welcome-student",
        actorRole: "student",
        sender: "gendio",
        text: "Chào bạn! Mình là Gendio — người bạn đồng hành tin cậy của học sinh THCS. Cuộc trò chuyện tại đây được bảo mật riêng tư (không hiển thị trên báo cáo của phụ huynh). Bạn đang thắc mắc về tuổi dậy thì, cảm xúc hay kỹ năng an toàn?",
        matchedTopic: "welcome",
        createdAt: new Date().toISOString(),
      },
      {
        id: "welcome-parent",
        actorRole: "parent",
        sender: "gendio",
        text: "Chào Phụ huynh! Tôi là trợ lý Gendio dành cho gia đình. Tôi có thể giải đáp về cơ chế bảo mật quyền riêng tư (NFR-S06), cách đọc báo cáo 7/14/30 ngày hoặc gợi ý cách mở lời trò chuyện tự nhiên cùng con.",
        matchedTopic: "welcome",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  if (!globalThis._inMemoryParentInbox) {
    globalThis._inMemoryParentInbox = [...INITIAL_PARENT_INBOX];
  }
  if (!globalThis._inMemoryNotifications) {
    globalThis._inMemoryNotifications = [...INITIAL_NOTIFICATIONS];
  }
  if (!globalThis._inMemoryTimerUsage) {
    globalThis._inMemoryTimerUsage = {};
  }

  return {
    gendioMessages: globalThis._inMemoryGendioMessages,
    parentInbox: globalThis._inMemoryParentInbox,
    notifications: globalThis._inMemoryNotifications,
    timerUsage: globalThis._inMemoryTimerUsage,
  };
}

