'use client';

import { ThemeProvider } from "@/global/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { RejectedForCodeActionCall } from "@/global/api/AsyncRequestBuilder";
import ToastProvider from "@/global/provider/ToastProvider";
import { createContext, useEffect } from "react";


const queryClient = reactQueryConfig();
export const QueryClientContext = createContext(queryClient);


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
      <QueryClientProvider client={queryClient}>
        <QueryClientContext.Provider value={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}



// react-query
function reactQueryConfig(): QueryClient{
  // react-query 전역 객체
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false, // 마운트 시에 리패치
        refetchOnWindowFocus: false, // 윈도우 포커스 시에 리패치
        retry: false, // 실패 시 재시도
        staleTime: 1000 * 60 * 60 // staleTime 1시간
      }
    }
  });
  return queryClient;
}