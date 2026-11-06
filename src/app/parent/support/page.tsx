"use client";

import React from "react";
import Link from "next/link";
import { PhoneCall, ShieldCheck } from "lucide-react";

export default function ParentSupportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Hỗ trợ Phụ huynh & Chính sách An toàn Trẻ em
        </h1>
        <p className="text-xs text-muted">
          Tài liệu hướng dẫn sử dụng GenUp và các kênh hỗ trợ chuyên môn khi cần thiết.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">
              Cam kết bảo mật dữ liệu học sinh THCS (NFR-S01 .. NFR-S08)
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              GenUp không yêu cầu trẻ cung cấp tên thật, địa chỉ hay số điện thoại cá nhân. Phụ huynh có toàn quyền quản lý liên kết gia đình hoặc yêu cầu xóa hồ sơ học tập bất cứ lúc nào.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-border">
          <PhoneCall className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">
              Tổng đài Quốc gia Bảo vệ Trẻ em: 111 (Miễn phí 24/7)
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Khi phát hiện trẻ có dấu hiệu bị đe dọa trực tuyến, bắt nạt hoặc xâm hại, phụ huynh và học sinh có thể liên hệ ngay Tổng đài 111 để được tư vấn tâm lý và can thiệp bảo vệ khẩn cấp.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <Link href="/parent/gendio" className="font-medium underline">
            Mở Trợ lý Gendio Phụ huynh
          </Link>
          <Link href="/admin" className="text-muted hover:text-foreground">
            Vào cổng CMS Quản trị nội dung (US-51) →
          </Link>
        </div>
      </div>
    </div>
  );
}

