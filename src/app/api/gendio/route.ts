import { NextRequest, NextResponse } from "next/server";
import { getFallbackStore, getMongoDatabase } from "@/lib/mongodb/client";
import { matchGendioResponse } from "@/lib/seed-data";
import { GendioChatMessage } from "@/lib/types";

export async function GET(request: NextRequest) {
  const roleParam = request.nextUrl.searchParams.get("role");
  const actorRole: "student" | "parent" = roleParam === "parent" ? "parent" : "student";

  // Quy tắc bảo mật NFR-S06: Tách cứng luồng tin nhắn Học sinh và Phụ huynh
  const db = await getMongoDatabase();
  if (db) {
    const docs = await db
      .collection<GendioChatMessage>("gendio_messages")
      .find({ actorRole })
      .sort({ createdAt: 1 })
      .limit(50)
      .toArray();
    return NextResponse.json({ messages: docs, storage: "mongodb" });
  }

  const store = getFallbackStore();
  return NextResponse.json({
    messages: store.gendioMessages.filter((m) => m.actorRole === actorRole),
    storage: "memory-fallback",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const rawText = typeof body?.text === "string" ? body.text.trim() : "";
  const actorRole: "student" | "parent" =
    body?.actorRole === "parent" ? "parent" : "student";

  // US-40 AC3: Không chấp nhận tin nhắn rỗng hoặc toàn khoảng trắng
  if (!rawText) {
    return NextResponse.json(
      { error: "Nội dung câu hỏi không được để trống." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const userMessage: GendioChatMessage = {
    id: `msg-u-${Date.now()}`,
    actorRole,
    sender: "user",
    text: rawText,
    createdAt: now,
  };

  const matched = matchGendioResponse(actorRole, rawText);
  const botMessage: GendioChatMessage = {
    id: `msg-g-${Date.now() + 1}`,
    actorRole,
    sender: "gendio",
    text: matched.reply,
    matchedTopic: matched.matchedTopic,
    requiresAdultSupport: matched.requiresAdultSupport,
    createdAt: new Date(Date.now() + 200).toISOString(),
  };

  const db = await getMongoDatabase();
  if (db) {
    await db
      .collection<GendioChatMessage>("gendio_messages")
      .insertMany([userMessage, botMessage]);
  } else {
    const store = getFallbackStore();
    store.gendioMessages.push(userMessage, botMessage);
  }

  return NextResponse.json({
    userMessage,
    botMessage,
  });
}

