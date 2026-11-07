import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "MindGauge | AI-Powered Psychometric Assessment Platform",
  description:
    "Enterprise-grade psychometric evaluation platform for talent recruitment, cognitive reasoning, Big Five personality, DISC behavioral analytics, and situational judgement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-slate-900 dark:text-slate-100">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

