import type { Metadata } from "next";
import "./globals.css";
import { GenUpProvider } from "@/context/GenUpContext";
import { AppShell } from "@/components/layout/AppShell";
import { ScrollbarAutohide } from "@/components/layout/ScrollbarAutohide";

export const metadata: Metadata = {
  title: "GenUp – Lớn lên tự tin, an toàn mỗi ngày",
  description:
    "Ứng dụng giáo dục giới tính, cảm xúc và kỹ năng tự bảo vệ dành cho học sinh trung học cơ sở (11–15 tuổi) và phụ huynh đồng hành.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ScrollbarAutohide />
        <GenUpProvider>
          <AppShell>{children}</AppShell>
        </GenUpProvider>
      </body>
    </html>
  );
}

