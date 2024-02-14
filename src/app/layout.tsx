import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../bounded-context/layout/Header";
import React from "react";
import GlobalProviders from "./GlobalProviders";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pageflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html 
      suppressHydrationWarning={true} // 서버와 클라 렌더링 간의 불일치 경고를 무시.(간혹 일치시키는 것이 매우 어렵거나 불가능함)
      lang="ko"
      >
      <head />
      <body className={inter.className}>
        <GlobalProviders>
          <Header />
          <div className="container">
            {children}
          </div>
        </GlobalProviders>
      </body>
    </html>
  );
}
