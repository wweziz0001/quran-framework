import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "القرآن الكريم - Quran Framework",
  description: "تطبيق القرآن الكريم المبني باستخدام منهجية Odoo Framework مع نظام وحدات متكامل",
  keywords: ["القرآن", "Quran", "Odoo", "Framework", "TypeScript", "Next.js"],
  authors: [{ name: "Quran Framework Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "القرآن الكريم - Quran Framework",
    description: "تطبيق القرآن الكريم المبني باستخدام منهجية Odoo Framework",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
