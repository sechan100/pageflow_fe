'use client';
import { ThemeProvider } from "@/global/provider/ThemeProvider";
import ToastProvider from "@/global/provider/ToastProvider";
import { useEffect } from "react";
import ReactQueryProvider from "./ReactQueryProvider";



export default function GlobalProviders({children} : {children: React.ReactNode}){

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}