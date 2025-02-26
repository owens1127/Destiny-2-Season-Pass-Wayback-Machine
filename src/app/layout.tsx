import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { CustomSessionProvider } from "@/components/auth/SessionProvider";
import { getServerSession } from "./api/auth";
import { cookies } from "next/headers";
import { ThemeButton } from "@/components/ThemeButton";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ColorContextProvider } from "@/hooks/useColor";
import { QueryClientProviderWrapper } from "@/components/auth/QueryClientProviderWrapper";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Season Pass Wayback Machine",
  description: "See your unclaimed rewards from past Destiny 2 seasons.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cks = await cookies();
  const serverSession = getServerSession(cks);

  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background flex flex-col h-full`}
      >
        <Analytics />
        <QueryClientProviderWrapper>
          <ColorContextProvider>
            <CustomSessionProvider serverSession={serverSession}>
              <header>
                <div className="flex flex-col gap-3 items-end p-4">
                  <AuthHeader />
                  <ThemeButton />
                </div>
              </header>
              {children}
            </CustomSessionProvider>
          </ColorContextProvider>
        </QueryClientProviderWrapper>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
