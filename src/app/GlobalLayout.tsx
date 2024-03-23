import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { cn } from "@/shared/libs/utils";
import GlobalProviders from "@/global/provider/GlobalProviders";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pageflow",
};

export default function GlobalLayout({ children }: Readonly<{children: React.ReactNode}>) {


  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body className={cn(inter.className)}>
        <GlobalProviders>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
