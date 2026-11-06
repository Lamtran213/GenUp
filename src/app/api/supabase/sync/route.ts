import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const firebaseUid =
      req.cookies.get("genup_firebase_uid")?.value || "";
    const body = await req.json();
    const uid = body.firebaseUid || firebaseUid;

    if (!uid) {
      return NextResponse.json({ ok: false, reason: "no_firebase_uid" });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return NextResponse.json({ ok: false, reason: "missing_supabase_env" });
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc("sync_student_profile_state", {
      p_firebase_uid: uid,
      p_nickname: body.nickname || "Minh Anh",
      p_grade: Number(body.grade) || 7,
      p_avatar_gender: body.avatarGender || "Female",
      p_equipped_hair_id: body.equippedHairId || "hair-bob",
      p_equipped_outfit_id: body.equippedOutfitId || "outfit-uniform",
      p_equipped_accessory_id: body.equippedAccessoryId || "acc-none",
      p_total_xp: Number(body.totalXp) || 0,
      p_reward_points: Number(body.rewardPoints) || 0,
      p_current_streak: Number(body.currentStreak) || 0,
      p_longest_streak: Number(body.longestStreak) || 0,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : "Sync failed",
    });
  }
}

