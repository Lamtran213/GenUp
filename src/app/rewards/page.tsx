"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, ShoppingBag, Sparkles } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { ACHIEVEMENT_BADGES, AVATAR_SHOP_ITEMS, DAILY_MISSIONS } from "@/lib/seed-data";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Nhiệm vụ, Huy hiệu & Cửa hàng Vật phẩm (US-24, US-27, US-28)
          </h1>
          <p className="text-xs text-muted">
            Sử dụng Reward Points tích lũy được để mở khóa kiểu tóc, trang phục và phụ kiện cho nhân vật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-10 px-3.5 rounded-xl bg-surface border border-border-strong flex items-center gap-2 text-xs font-semibold tabular-nums">
            <Award className="w-4 h-4 text-foreground" />
            <span>{profile.rewardPoints} Reward Points</span>
          </div>
          <Link
            href="/avatar"
            className="h-10 px-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mở Avatar Studio</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-surface border border-border-strong text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-muted hover:text-foreground"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Tủ Huy hiệu thành tích (US-27) */}
      <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tủ Huy hiệu Thành tích (US-27)</h2>
          <span className="text-xs text-muted tabular-nums">
            Đã mở khóa {profile.unlockedBadgeIds.length} / {ACHIEVEMENT_BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = profile.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border space-y-1.5 ${
                  unlocked
                    ? "bg-background border-border-strong"
                    : "bg-surface border-border opacity-65"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{badge.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      unlocked
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {unlocked ? "Đã sở hữu" : "Chưa mở"}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {badge.description}
                </p>
                <p className="text-[11px] text-muted pt-1">
                  Điều kiện: {badge.conditionText}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cửa hàng đổi Reward Points lấy vật phẩm (US-28, US-29) */}
      <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-foreground" />
            <h2 className="text-sm font-semibold">
              Cửa hàng Vật phẩm Avatar (US-28)
            </h2>
          </div>
          <span className="text-xs text-muted">
            Chống trừ điểm trùng khi mua vật phẩm đã sở hữu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {AVATAR_SHOP_ITEMS.map((item) => {
            const owned = profile.ownedItemIds.includes(item.id);
            const equipped =
              profile.equippedHairId === item.id ||
              profile.equippedOutfitId === item.id ||
              profile.equippedAccessoryId === item.id;
            const canAfford = profile.rewardPoints >= item.cost;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-background border border-border-strong flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface text-[11px] font-medium tabular-nums">
                      {item.cost === 0 ? "Mặc định" : `${item.cost} Điểm`}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[11px] text-muted uppercase">
                    {item.category === "hair"
                      ? "Kiểu tóc"
                      : item.category === "outfit"
                      ? "Trang phục"
                      : "Phụ kiện"}
                  </span>

                  {equipped ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đang mặc</span>
                    </span>
                  ) : owned ? (
                    <button
                      type="button"
                      onClick={() => handleBuyOrEquip(item.id)}
                      className="h-8 px-3 rounded-lg border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium"
                    >
                      Trang bị ngay
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuyOrEquip(item.id)}
                      disabled={!canAfford}
                      className={`h-8 px-3 rounded-lg text-xs font-medium ${
                        canAfford
                          ? "bg-primary hover:bg-primary-hover text-primary-foreground"
                          : "bg-secondary text-muted cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? "Đổi & Mặc" : "Chưa đủ điểm"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nhiệm vụ hằng ngày (US-24) */}
      <section className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold">Nhiệm vụ học tập hằng ngày (US-24)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DAILY_MISSIONS.map((m) => {
            const done = completedMissionIdsToday.includes(m.id);
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-background border border-border-strong space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    +{m.rewardPoints} Điểm · +{m.xpReward} XP
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      done
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {done ? "Hoàn thành" : "Trong ngày"}
                  </span>
                </div>
                <p className="text-xs text-muted">{m.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

