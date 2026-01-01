import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "RESET 2026 - 30 Days Digital Detox | Detox Mind",
  description: "A safe, anonymous space for your 30-day digital detox journey. Build new habits, one day at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
