import type { Metadata } from "next";
import "./globals.css";
import { Syne } from "next/font/google";
import BackgroundSection from "@/components/Background";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"

const syne = Syne({
  variable: "--font-syne-sans",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Nest-Decor Your Peace",
  description: "Interior and Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={syne.className}>
        <BackgroundSection />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
