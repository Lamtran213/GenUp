"use client";

import React from "react";

interface Avatar2DProps {
  gender: "Male" | "Female";
  hairId: string;
  outfitId: string;
  accessoryId: string;
  size?: number;
}

export function Avatar2D({
  gender,
  hairId,
  outfitId,
  accessoryId,
  size = 120,
}: Avatar2DProps) {
  const outfitColor =
    outfitId === "outfit-hoodie"
      ? "#0f766e"
      : outfitId === "outfit-jacket"
      ? "#1d4ed8"
      : "#27272a";

  const hairColor = gender === "Female" ? "#27272a" : "#18181b";

  return (
    <div
      className="inline-flex items-center justify-center rounded-xl bg-background border border-border-strong select-none overflow-hidden"
      style={{ width: size, height: size }}
      aria-label={`Nhân vật đại diện ${gender === "Female" ? "Nữ" : "Nam"}`}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vòng tròn nền nhẹ */}
        <circle cx="60" cy="60" r="52" fill="#e7e8ec" />

        {/* Thân & Trang phục */}
        <path
          d="M28 112C28 90 42 80 60 80C78 80 92 90 92 112H28Z"
          fill={outfitColor}
        />
        {outfitId === "outfit-uniform" && (
          <path d="M50 80L60 95L70 80H50Z" fill="#ffffff" />
        )}
        {outfitId === "outfit-hoodie" && (
          <path
            d="M46 82C46 82 53 92 60 92C67 92 74 82 74 82"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
        {outfitId === "outfit-jacket" && (
          <line
            x1="60"
            y1="80"
            x2="60"
            y2="112"
            stroke="#93c5fd"
            strokeWidth="3"
          />
        )}

        {/* Cổ & Khuôn mặt */}
        <rect x="53" y="68" width="14" height="14" rx="6" fill="#fde68a" />
        <circle cx="60" cy="52" r="22" fill="#fef3c7" />

        {/* Mắt & Nụ cười thân thiện */}
        <circle cx="52" cy="51" r="2.6" fill="#18181b" />
        <circle cx="68" cy="51" r="2.6" fill="#18181b" />
        <path
          d="M53 60C55 63 65 63 67 60"
          stroke="#18181b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Kiểu tóc */}
        {hairId === "hair-bob" && (
          <path
            d={
              gender === "Female"
                ? "M36 52C36 33 46 26 60 26C74 26 84 33 84 52C84 58 82 65 79 68C79 52 75 40 60 40C45 40 41 52 41 68C38 65 36 58 36 52Z"
                : "M38 46C38 32 47 26 60 26C73 26 82 32 82 46C76 39 68 37 60 37C52 37 44 39 38 46Z"
            }
            fill={hairColor}
          />
        )}
        {hairId === "hair-spiky" && (
          <path
            d="M37 45L42 29L51 34L60 23L69 34L78 29L83 45C75 39 68 37 60 37C52 37 45 39 37 45Z"
            fill={hairColor}
          />
        )}
        {hairId === "hair-curly" && (
          <g fill={hairColor}>
            <circle cx="44" cy="36" r="9" />
            <circle cx="60" cy="31" r="10" />
            <circle cx="76" cy="36" r="9" />
            <circle cx="38" cy="47" r="7" />
            <circle cx="82" cy="47" r="7" />
          </g>
        )}

        {/* Phụ kiện */}
        {accessoryId === "acc-glasses" && (
          <g stroke="#18181b" strokeWidth="2">
            <rect x="44" y="46" width="12" height="9" rx="2" fill="none" />
            <rect x="64" y="46" width="12" height="9" rx="2" fill="none" />
            <line x1="56" y1="50" x2="64" y2="50" />
          </g>
        )}
        {accessoryId === "acc-cap" && (
          <g>
            <path d="M38 38C40 26 50 22 60 22C70 22 80 26 82 38H38Z" fill="#0284c7" />
            <rect x="36" y="36" width="52" height="5" rx="2.5" fill="#0369a1" />
          </g>
        )}
      </svg>
    </div>
  );
}

