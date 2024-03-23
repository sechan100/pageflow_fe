import "../globals.css";
import Header from "../../bounded-context/common/Header";
import React from "react";
import GlobalLayout from "../GlobalLayout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <Header />
      <div className="container">
        {children}
      </div>
    </GlobalLayout>
  );
}
