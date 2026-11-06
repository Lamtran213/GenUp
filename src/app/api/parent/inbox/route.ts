import { NextRequest, NextResponse } from "next/server";
import { getFallbackStore, getMongoDatabase } from "@/lib/mongodb/client";
import { ParentInboxMessage } from "@/lib/types";

export async function GET() {
  const db = await getMongoDatabase();
  if (db) {
    const messages = await db
      .collection<ParentInboxMessage>("parent_inbox_messages")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ messages, storage: "mongodb" });
  }

  const store = getFallbackStore();
  return NextResponse.json({
    messages: store.parentInbox,
    storage: "memory-fallback",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const category = body.category || "progress_report";
  const periodDays: 7 | 14 | 30 = [7, 14, 30].includes(Number(body.periodDays))
    ? (Number(body.periodDays) as 7 | 14 | 30)
    : 7;
  const completedCount = Number(body.completedLessons ?? 1);
  const scenarioCount = Number(body.resolvedScenarios ?? 1);
  const streak = Number(body.currentStreak ?? 1);

  // NFR-S06 & US-36 AC4: Chỉ tạo nội dung báo cáo tổng hợp, không bao giờ chứa câu trả lời riêng của học sinh
  const newMsg: ParentInboxMessage = {
    id: `inbox-${Date.now()}`,
    category,
    periodDays,
    subject:
      category === "progress_report"
        ? `[Báo cáo ${periodDays} ngày] Tổng hợp tiến độ học tập của con`
        : category === "study_reminder"
        ? "Lời nhắc duy trì thói quen học 15 phút mỗi ngày"
        : category === "new_content"
        ? "Bài học mới: Kỹ năng tự bảo vệ trên không gian mạng"
        : "Thông tin cập nhật quyền lợi gói GenUp Premium",
    previewText: `Tổng kết ${periodDays} ngày gần nhất: Hoàn thành ${completedCount} bài học, thực hành ${scenarioCount} tình huống, chuỗi Streak ${streak} ngày.`,
    bodyText: `Báo cáo định kỳ (${periodDays} ngày): Hồ sơ học sinh liên kết đã hoàn thành ${completedCount} bài học có cấu trúc và giải quyết ${scenarioCount} tình huống thực hành, duy trì chuỗi học ${streak} ngày liên tiếp. Theo chính sách bảo vệ quyền riêng tư trẻ em (NFR-S06), báo cáo này chỉ hiển thị số liệu tổng quan và ẩn toàn bộ đáp án tình huống cũng như lịch sử chat riêng của con.`,
    conversationPrompts: [
      "Tuần này con thấy chủ đề nào trên GenUp thú vị hoặc gần gũi với chuyện ở lớp nhất?",
      "Nếu gặp một tình huống khiến con bối rối ở trường hoặc trên mạng, con muốn bố mẹ hỗ trợ theo cách nào?",
    ],
    isRead: false,
    isSimulated: true,
    createdAt: new Date().toISOString(),
  };

  const db = await getMongoDatabase();
  if (db) {
    await db.collection<ParentInboxMessage>("parent_inbox_messages").insertOne(newMsg);
  } else {
    const store = getFallbackStore();
    store.parentInbox.unshift(newMsg);
  }

  return NextResponse.json({ message: newMsg });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");

  const db = await getMongoDatabase();
  if (db) {
    await db
      .collection<ParentInboxMessage>("parent_inbox_messages")
      .updateOne({ id }, { $set: { isRead: true } });
  } else {
    const store = getFallbackStore();
    const target = store.parentInbox.find((m) => m.id === id);
    if (target) target.isRead = true;
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";

  const db = await getMongoDatabase();
  if (db) {
    await db.collection<ParentInboxMessage>("parent_inbox_messages").deleteOne({ id });
  } else {
    const store = getFallbackStore();
    store.parentInbox = store.parentInbox.filter((m) => m.id !== id);
    globalThis._inMemoryParentInbox = store.parentInbox;
  }

  return NextResponse.json({ ok: true });
}

