'use client';

import { ThemeProvider } from "@/global/provider/ThemeProvider";
import { RejectedForCodeActionCall } from "@/global/api/AsyncRequestBuilder";
import ToastProvider from "@/global/provider/ToastProvider";
import { useEffect } from "react";
import ReactQueryProvider from "./ReactQueryProvider";



export default function GlobalProviders({children} : {children: React.ReactNode}){

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      // CodeActions에 의해서 이미 처리된 Promise인 경우 무시
      if(reason instanceof RejectedForCodeActionCall){
        // console.debug(`[GlobalProviders]: unhandledrejection 이벤트 핸들러에서 apiCode [${reason.name}]로 인해 reject된 Promise를 진압하여 처리함.`);
        event.preventDefault();
        return;
      }
    };
    // 거부된 프로미스 처리 로직
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

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