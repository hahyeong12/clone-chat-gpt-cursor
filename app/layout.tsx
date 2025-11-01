import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TokenSender } from "@/components/token-sender";
import { ChatProvider } from "@/lib/chat-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "약장수 - AI 의약품 추천 챗봇",
  description: "AI 기반 의약품 추천 챗봇입니다. 증상을 입력하면 적합한 약을 추천해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ChatProvider>
            <TokenSender />
            {children}
          </ChatProvider>
        </Providers>
      </body>
    </html>
  );
}
