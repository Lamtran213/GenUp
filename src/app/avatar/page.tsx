"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useGenUp } from "@/context/GenUpContext";
import { Avatar2D } from "@/components/avatar/Avatar2D";
import { AVATAR_SHOP_ITEMS } from "@/lib/seed-data";

export default function AvatarStudioPage() {
  const { profile, updateProfile } = useGenUp();

  // US-06 AC2 & AC3: Xem trước nhiều lựa chọn mà chưa ghi đè ngay; vô hiệu hóa nút Lưu khi không có thay đổi
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
    setSavedNotice("Đã lưu ngoại hình nhân vật đại diện mới!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Avatar Studio 2D (US-05, US-06, US-29)
          </h1>
          <p className="text-xs text-muted">
            Xem trước kiểu tóc, trang phục và phụ kiện đã sở hữu trước khi nhấn Lưu nhân vật.
          </p>
        </div>

        <Link
          href="/rewards"
          className="h-9 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium inline-flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Đổi thêm vật phẩm ({profile.rewardPoints} Điểm)</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Khung Xem trước Nhân vật (Preview) */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
          <Avatar2D
            gender={previewGender}
            hairId={previewHair}
            outfitId={previewOutfit}
            accessoryId={previewAccessory}
            size={160}
          />
          <div className="text-center space-y-0.5">
            <p className="text-base font-semibold">{profile.nickname}</p>
            <p className="text-xs text-muted">
              {hasChanges ? "Đang xem trước thay đổi (Chưa lưu)" : "Ngoại hình đang sử dụng"}
            </p>
          </div>

          {savedNotice && (
            <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedNotice}</span>
            </p>
          )}

          {/* US-06 AC3: Nút Lưu không khả dụng khi chưa có thay đổi */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className={`w-full h-10 rounded-xl text-xs font-medium transition-colors ${
              hasChanges
                ? "bg-primary hover:bg-primary-hover text-primary-foreground"
                : "bg-secondary text-muted cursor-not-allowed"
            }`}
          >
            {hasChanges ? "Lưu nhân vật" : "Chưa có thay đổi để lưu"}
          </button>
        </div>

        {/* Bảng chọn các lớp SVG (Giới tính, Kiểu tóc, Trang phục, Phụ kiện) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold block">
              1. Giới tính nhân vật (US-05)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["Female", "Male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setPreviewGender(g);
                    setSavedNotice(null);
                  }}
                  className={`h-10 rounded-xl border text-xs font-medium ${
                    previewGender === g
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-foreground border-border-strong hover:bg-button-hover"
                  }`}
                >
                  {g === "Female" ? "Nhân vật Nữ" : "Nhân vật Nam"}
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
                <label className="text-xs font-semibold block">
                  {idx + 2}.{" "}
                  {category === "hair"
                    ? "Kiểu tóc (US-06)"
                    : category === "outfit"
                    ? "Trang phục (US-29)"
                    : "Phụ kiện (US-29)"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {items.map((item) => {
                    const owned = profile.ownedItemIds.includes(item.id);
                    const selected = currentVal === item.id;
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
                        className={`p-3 rounded-xl border text-left transition-colors ${
                          selected
                            ? "bg-secondary border-primary"
                            : owned || category === "hair"
                            ? "bg-surface border-border-strong hover:bg-button-hover"
                            : "bg-background border-border opacity-55 cursor-not-allowed"
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {owned || category === "hair"
                            ? "Có thể trang bị"
                            : `Cần mở khóa (${item.cost} Điểm)`}
                        </p>
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

