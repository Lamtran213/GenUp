"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Gem, Lock, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { ACHIEVEMENT_BADGES, AVATAR_SHOP_ITEMS, DAILY_MISSIONS } from "@/lib/seed-data";

const ITEM_STICKERS: Record<
  string,
  { emoji: string; tag: string; bg: string; border: string }
> = {
  "hair-bob": {
    emoji: "💇‍♀️",
    tag: "Gọn gàng",
    bg: "from-emerald-100/80 to-teal-100/70",
    border: "border-emerald-300/80",
  },
  "hair-spiky": {
    emoji: "⚡",
    tag: "Cá tính",
    bg: "from-amber-100/80 to-orange-100/70",
    border: "border-amber-300/80",
  },
  "hair-curly": {
    emoji: "🌸",
    tag: "Bồng bềnh",
    bg: "from-rose-100/80 to-pink-100/70",
    border: "border-rose-300/80",
  },
  "outfit-uniform": {
    emoji: "🎒",
    tag: "Học đường",
    bg: "from-sky-100/80 to-blue-100/70",
    border: "border-sky-300/80",
  },
  "outfit-hoodie": {
    emoji: "🛡️",
    tag: "Hiệp sĩ Xanh",
    bg: "from-emerald-100/85 to-cyan-100/75",
    border: "border-emerald-400/80",
  },
  "outfit-jacket": {
    emoji: "🧥",
    tag: "Siêu cấp",
    bg: "from-indigo-100/85 to-violet-100/75",
    border: "border-indigo-300/80",
  },
  "acc-none": {
    emoji: "✨",
    tag: "Tối giản",
    bg: "from-slate-100/80 to-zinc-100/70",
    border: "border-slate-300/80",
  },
  "acc-glasses": {
    emoji: "🤓",
    tag: "Tri thức",
    bg: "from-amber-100/85 to-yellow-100/75",
    border: "border-amber-300/80",
  },
  "acc-cap": {
    emoji: "🧢",
    tag: "Giới hạn",
    bg: "from-violet-100/85 to-fuchsia-100/75",
    border: "border-violet-300/80",
  },
};

const BADGE_STICKERS: Record<string, { emoji: string; bg: string }> = {
  "badge-first-lesson": { emoji: "🌱", bg: "bg-emerald-100/80 border-emerald-300" },
  "badge-boundary-guardian": { emoji: "🛡️", bg: "bg-sky-100/80 border-sky-300" },
  "badge-streak-3": { emoji: "🔥", bg: "bg-amber-100/80 border-amber-300" },
  "badge-xp-master": { emoji: "👑", bg: "bg-violet-100/80 border-violet-300" },
};

const MISSION_STICKERS: Record<string, string> = {
  lesson: "📘",
  scenario: "🧭",
  review: "🔄",
};

export default function RewardsAndShopPage() {
  const {
    profile,
    completedMissionIdsToday,
    purchaseAvatarItem,
    equipAvatarItem,
  } = useGenUp();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuyOrEquip = (itemId: string) => {
    const owned = profile.ownedItemIds.includes(itemId);
    const res = owned ? equipAvatarItem(itemId) : purchaseAvatarItem(itemId);
    setFeedback(res.message);
  };

  return (
    <div className="space-y-6">
      {/* Header gọn gàng chuẩn Game Shop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Kho báu & Trang bị
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Cửa hàng Sticker & Vật phẩm 2D
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-10 px-4 rounded-xl liquid-glass flex items-center gap-2 text-xs font-extrabold text-sky-900 tabular-nums">
            <Gem className="w-4 h-4 text-sky-600" />
            <span>{profile.rewardPoints} Điểm</span>
          </div>
          <Link
            href="/avatar"
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Phòng thay đồ 2D</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl liquid-glass text-xs font-bold text-emerald-950 flex items-center justify-between">
          <span>🎉 {feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-700"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Tủ Huy hiệu thành tích (Ít chữ, Sticker to) */}
      <section className="liquid-glass rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>🏆 Tủ Huy Hiệu</span>
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-white text-emerald-900 text-xs font-bold tabular-nums">
            {profile.unlockedBadgeIds.length} / {ACHIEVEMENT_BADGES.length} đã mở
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = profile.unlockedBadgeIds.includes(badge.id);
            const sticker = BADGE_STICKERS[badge.id] || {
              emoji: "🎖️",
              bg: "bg-emerald-100/80 border-emerald-300",
            };

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col items-center text-center gap-2 transition-all ${
                  unlocked
                    ? "bg-white/65 border-white shadow-xs"
                    : "bg-white/30 border-white/60 opacity-65"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-2xs ${sticker.bg}`}
                >
                  {sticker.emoji}
                </div>

                <p className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {badge.title}
                </p>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    unlocked
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {unlocked ? "✓ Đã sở hữu" : badge.conditionText}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cửa hàng Vật phẩm Avatar (Sticker nổi bật, ít chữ) */}
      <section className="liquid-glass rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Cửa hàng Vật phẩm Avatar
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Chạm để đổi & mặc ngay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVATAR_SHOP_ITEMS.map((item) => {
            const owned = profile.ownedItemIds.includes(item.id);
            const equipped =
              profile.equippedHairId === item.id ||
              profile.equippedOutfitId === item.id ||
              profile.equippedAccessoryId === item.id;
            const canAfford = profile.rewardPoints >= item.cost;
            const sticker = ITEM_STICKERS[item.id] || {
              emoji: "🎁",
              tag: "Vật phẩm",
              bg: "from-emerald-100/80 to-teal-100/70",
              border: "border-emerald-300/80",
            };

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3.5 transition-all ${
                  equipped
                    ? "bg-emerald-50/80 border-emerald-400 shadow-sm"
                    : "bg-white/60 border-white/90 hover:bg-white/80"
                }`}
              >
                {/* Cụm trái: Sticker Vật phẩm + Tên ngắn gọn */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sticker.bg} border-2 ${sticker.border} flex items-center justify-center text-3xl shrink-0 shadow-xs`}
                  >
                    {sticker.emoji}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-white/80 border border-white text-[10px] font-bold text-slate-700">
                        {item.category === "hair"
                          ? "💇 Tóc"
                          : item.category === "outfit"
                          ? "👕 Áo"
                          : "🕶️ Phụ kiện"}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800">
                        · {sticker.tag}
                      </span>
                    </div>

                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {item.name}
                    </p>

                    <p className="text-xs font-bold text-sky-800 tabular-nums">
                      {item.cost === 0 ? "🎁 Miễn phí" : `💎 ${item.cost} Điểm`}
                    </p>
                  </div>
                </div>

                {/* Cụm phải: Nút bấm 1 chạm */}
                <div className="shrink-0">
                  {equipped ? (
                    <span className="h-9 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đang mặc</span>
                    </span>
                  ) : owned ? (
                    <button
                      type="button"
                      onClick={() => handleBuyOrEquip(item.id)}
                      className="h-9 px-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold transition-colors"
                    >
                      Mặc ngay
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuyOrEquip(item.id)}
                      disabled={!canAfford}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all ${
                        canAfford
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                          : "bg-slate-200/80 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? (
                        <span>Đổi & Mặc</span>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Thiếu điểm</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nhiệm vụ hằng ngày gọn gàng kèm Sticker */}
      <section className="liquid-glass rounded-3xl p-5 space-y-3.5">
        <h2 className="text-sm font-extrabold text-slate-900">
          🎯 Nhiệm vụ Hôm nay
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {DAILY_MISSIONS.map((m) => {
            const done = completedMissionIdsToday.includes(m.id);
            const emoji = MISSION_STICKERS[m.id] || "⭐";
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-white/60 border border-white/90 flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
                  {emoji}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {m.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-800 inline-flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />+
                      {m.xpReward} XP · +{m.rewardPoints} Điểm
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        done
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-200/80 text-amber-950"
                      }`}
                    >
                      {done ? "✓ Xong" : "Đang mở"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
