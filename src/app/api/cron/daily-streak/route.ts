import { NextRequest, NextResponse } from "next/server";
import { sendMobilePushNotification } from "@/lib/firebase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized Cron Trigger" }, { status: 401 });
  }

  let tokens: string[] = [];
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.from("user_devices").select("fcm_token").limit(100);
    if (data) {
      tokens = data.map((d) => d.fcm_token).filter(Boolean);
    }
  }

  const pushResult = await sendMobilePushNotification({
    tokens,
    title: "🔥 Đừng để tuột chuỗi Learning Streak hôm nay!",
    body: "Chỉ cần 5 phút thực hành tình huống trên GenUp để giữ vững chuỗi ngày học của bạn.",
    actionUrl: "/lessons",
  });

  return NextResponse.json({
    ok: true,
    triggeredAt: new Date().toISOString(),
    pushResult,
  });
}

