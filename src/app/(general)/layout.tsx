import "../globals.css";
import HeaderLayout from "../../bounded-context/common/HeaderLayout";
import React from "react";
import GlobalLayout from "../GlobalLayout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <HeaderLayout />
      <div className="container">
        {children}
      </div>
    </GlobalLayout>
  );
}
