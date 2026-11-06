"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar2D } from "@/components/avatar/Avatar2D";
import { AVATAR_SHOP_ITEMS } from "@/lib/seed-data";
import { useGenUp } from "@/context/GenUpContext";

export default function ChooseAvatarPage() {
  const router = useRouter();
  const { profile, updateProfile } = useGenUp();

  // US-05 AC2 & AC3: Giữ lựa chọn tạm ở state cục bộ, chỉ lưu chính thức khi nhấn nút Hoàn thành
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female">(
    profile.avatarGender
  );
  const [selectedHair, setSelectedHair] = useState<string>(profile.equippedHairId);

  const hairOptions = AVATAR_SHOP_ITEMS.filter((i) => i.category === "hair");

  const handleConfirm = () => {
    updateProfile({
      avatarGender: selectedGender,
      equippedHairId: selectedHair,
      isOnboarded: true,
    });
    router.push("/dashboard");
  };

  // US-01 AC2: Cho phép dùng nhân vật mẫu mặc định
  const handleUseDefault = () => {
    updateProfile({
      avatarGender: "Female",
      equippedHairId: "hair-bob",
      equippedOutfitId: "outfit-uniform",
      isOnboarded: true,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted">
            Bước 2 / 2 · Chọn nhân vật đại diện (US-05, US-06)
          </span>
          <h1 className="text-xl font-semibold tracking-tight">
            Tùy chỉnh nhân vật đồng hành cùng {profile.nickname}
          </h1>
          <p className="text-xs text-muted">
            Bạn có thể đổi thêm trang phục và phụ kiện bất cứ lúc nào trong Avatar Studio.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-4 bg-background rounded-xl border border-border">
          <Avatar2D
            gender={selectedGender}
            hairId={selectedHair}
            outfitId={profile.equippedOutfitId}
            accessoryId={profile.equippedAccessoryId}
            size={136}
          />
          <p className="mt-2.5 text-sm font-medium">{profile.nickname}</p>
          <p className="text-xs text-muted">Lớp {profile.grade}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Giới tính nhân vật
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["Female", "Male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGender(g)}
                  className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                    selectedGender === g
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-foreground border-border-strong hover:bg-button-hover"
                  }`}
                >
                  {g === "Female" ? "Nhân vật Nữ" : "Nhân vật Nam"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Kiểu tóc
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hairOptions.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHair(h.id)}
                  className={`h-10 px-2.5 rounded-xl border text-xs font-medium truncate transition-colors ${
                    selectedHair === h.id
                      ? "bg-secondary text-foreground border-border-strong"
                      : "bg-surface text-muted border-border-strong hover:bg-button-hover"
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleUseDefault}
            className="h-10 px-3.5 rounded-xl border border-border-strong bg-surface hover:bg-button-hover text-xs font-medium"
          >
            Dùng nhân vật mặc định
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium"
          >
            Hoàn thành & Vào Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

