import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "LSI勤怠管理システム",
  description: "LSI勤怠管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
