import { NextRequest, NextResponse } from "next/server";
import { getFallbackStore, getMongoDatabase } from "@/lib/mongodb/client";

const FREE_DAILY_LIMIT_SECONDS = 900; // 15 phút = 900 giây (US-30)

export async function GET(request: NextRequest) {
  const dateKey =
    request.nextUrl.searchParams.get("dateKey") ||
    new Date().toISOString().slice(0, 10);

  const db = await getMongoDatabase();
  if (db) {
    const doc = await db
      .collection("daily_usage_heartbeats")
      .findOne({ dateKey });
    const used = Number(doc?.activeSecondsUsed ?? 0);
    return NextResponse.json({
      dateKey,
      activeSecondsUsed: used,
      remainingSeconds: Math.max(0, FREE_DAILY_LIMIT_SECONDS - used),
    });
  }

  const store = getFallbackStore();
  const used = store.timerUsage[dateKey] ?? 0;
  return NextResponse.json({
    dateKey,
    activeSecondsUsed: used,
    remainingSeconds: Math.max(0, FREE_DAILY_LIMIT_SECONDS - used),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const dateKey =
    typeof body.dateKey === "string"
      ? body.dateKey
      : new Date().toISOString().slice(0, 10);
  const activeSecondsUsed = Math.min(
    FREE_DAILY_LIMIT_SECONDS,
    Math.max(0, Number(body.activeSecondsUsed ?? 0))
  );

  const db = await getMongoDatabase();
  if (db) {
    await db.collection("daily_usage_heartbeats").updateOne(
      { dateKey },
      {
        $set: {
          activeSecondsUsed,
          lastHeartbeatAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
  } else {
    const store = getFallbackStore();
    store.timerUsage[dateKey] = activeSecondsUsed;
  }

  return NextResponse.json({
    dateKey,
    activeSecondsUsed,
    remainingSeconds: Math.max(0, FREE_DAILY_LIMIT_SECONDS - activeSecondsUsed),
  });
}

