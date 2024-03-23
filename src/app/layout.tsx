import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../bounded-context/common/Header";
import React from "react";
import GlobalProviders from "../global/provider/GlobalProviders";


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
    <html lang="ko" suppressHydrationWarning>
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
