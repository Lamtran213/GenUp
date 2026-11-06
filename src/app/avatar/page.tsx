"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ShoppingBag, Sparkles } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { Avatar2D } from "@/components/avatar/Avatar2D";
import { AVATAR_SHOP_ITEMS } from "@/lib/seed-data";

const ITEM_STICKERS: Record<string, { emoji: string; bg: string }> = {
  "hair-bob": { emoji: "💇‍♀️", bg: "bg-emerald-100/80 border-emerald-300" },
  "hair-spiky": { emoji: "⚡", bg: "bg-amber-100/80 border-amber-300" },
  "hair-curly": { emoji: "🌸", bg: "bg-rose-100/80 border-rose-300" },
  "outfit-uniform": { emoji: "🎒", bg: "bg-sky-100/80 border-sky-300" },
  "outfit-hoodie": { emoji: "🛡️", bg: "bg-emerald-100/80 border-emerald-300" },
  "outfit-jacket": { emoji: "🧥", bg: "bg-indigo-100/80 border-indigo-300" },
  "acc-none": { emoji: "✨", bg: "bg-slate-100/80 border-slate-300" },
  "acc-glasses": { emoji: "🤓", bg: "bg-amber-100/80 border-amber-300" },
  "acc-cap": { emoji: "🧢", bg: "bg-violet-100/80 border-violet-300" },
};

export default function AvatarStudioPage() {
  const { profile, updateProfile } = useGenUp();

  const [previewGender, setPreviewGender] = useState<"Male" | "Female">(
    profile.avatarGender
  );
  const [previewHair, setPreviewHair] = useState<string>(profile.equippedHairId);
  const [previewOutfit, setPreviewOutfit] = useState<string>(
    profile.equippedOutfitId
  );
  const [previewAccessory, setPreviewAccessory] = useState<string>(
    profile.equippedAccessoryId
  );
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const hasChanges =
    previewGender !== profile.avatarGender ||
    previewHair !== profile.equippedHairId ||
    previewOutfit !== profile.equippedOutfitId ||
    previewAccessory !== profile.equippedAccessoryId;

  const handleSave = () => {
    if (!hasChanges) return;
    updateProfile({
      avatarGender: previewGender,
      equippedHairId: previewHair,
      equippedOutfitId: previewOutfit,
      equippedAccessoryId: previewAccessory,
    });
    setSavedNotice("Đã lưu trang phục mới!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Phòng thay đồ 2D
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Tùy chỉnh Nhân vật Đại diện
          </h1>
        </div>

        <Link
          href="/rewards"
          className="h-10 px-4 rounded-xl liquid-glass hover:bg-white/75 text-xs font-bold text-slate-900 inline-flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" />
          <span>Cửa hàng Vật phẩm ({profile.rewardPoints} Điểm)</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Khung Xem trước Nhân vật Liquid Glass */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-3xl bg-white/75 border-2 border-white shadow-sm">
            <Avatar2D
              gender={previewGender}
              hairId={previewHair}
              outfitId={previewOutfit}
              accessoryId={previewAccessory}
              size={156}
            />
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-base font-extrabold text-slate-900">
              {profile.nickname}
            </p>
            <p className="text-xs font-medium text-slate-600">
              {hasChanges ? "✨ Đang thử đồ mới" : "✓ Trang phục đang mặc"}
            </p>
          </div>

          {savedNotice && (
            <p className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-white px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedNotice}</span>
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className={`w-full h-10 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
              hasChanges
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                : "bg-white/50 text-slate-400 border border-white/70 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hasChanges ? "Lưu trang phục ngay" : "Đang mặc bộ này"}</span>
          </button>
        </div>

        {/* Bảng chọn vật phẩm có Sticker */}
        <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              1. Chọn Nhân vật
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["Female", "Male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setPreviewGender(g);
                    setSavedNotice(null);
                  }}
                  className={`h-11 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    previewGender === g
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white/60 text-slate-800 border-white hover:bg-white/80"
                  }`}
                >
                  <span className="text-base">{g === "Female" ? "👧" : "👦"}</span>
                  <span>{g === "Female" ? "Nhân vật Nữ" : "Nhân vật Nam"}</span>
                </button>
              ))}
            </div>
          </div>

          {(["hair", "outfit", "accessory"] as const).map((category, idx) => {
            const items = AVATAR_SHOP_ITEMS.filter((i) => i.category === category);
            const currentVal =
              category === "hair"
                ? previewHair
                : category === "outfit"
                ? previewOutfit
                : previewAccessory;

            return (
              <div key={category} className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">
                  {idx + 2}.{" "}
                  {category === "hair"
                    ? "Kiểu tóc"
                    : category === "outfit"
                    ? "Trang phục"
                    : "Phụ kiện"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {items.map((item) => {
                    const owned = profile.ownedItemIds.includes(item.id);
                    const selected = currentVal === item.id;
                    const sticker = ITEM_STICKERS[item.id] || {
                      emoji: "🎁",
                      bg: "bg-emerald-100/80 border-emerald-300",
                    };

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!owned && category !== "hair"}
                        onClick={() => {
                          setSavedNotice(null);
                          if (category === "hair") setPreviewHair(item.id);
                          if (category === "outfit" && owned) setPreviewOutfit(item.id);
                          if (category === "accessory" && owned)
                            setPreviewAccessory(item.id);
                        }}
                        className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                          selected
                            ? "bg-emerald-50/90 border-2 border-emerald-500 shadow-xs"
                            : owned || category === "hair"
                            ? "bg-white/60 border-white hover:bg-white/85"
                            : "bg-white/30 border-white/60 opacity-55 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${sticker.bg}`}
                        >
                          {sticker.emoji}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                            {owned || category === "hair" ? (
                              selected ? (
                                <span className="text-emerald-700 font-bold">✓ Đang thử</span>
                              ) : (
                                <span>Sẵn sàng</span>
                              )
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>{item.cost} Điểm</span>
                              </>
                            )}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
