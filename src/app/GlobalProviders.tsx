'use client';

import { ThemeProvider } from "@/global/theme/ThemeProvider";
import { SessionManager } from "@/hooks/useSession";
import { DefaultAxiosFactory } from "@/api/AnonymousApi";
import { AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "@/api/AccessTokenStorage";
import { createContext, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RejectedForCodeActionCall } from "@/api/RequestInstance";
import ToastProvider from "@/global/toast/ToastProvider";


const queryClient = reactQueryConfig();
export const SessionContext = createContext<SessionContext>(initSession());



export default function GlobalProviders({children} : {children: React.ReactNode}){

  useEffect(() => {

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      // CodeActions에 의해서 이미 처리된 Promise인 경우 무시
      if(reason instanceof RejectedForCodeActionCall){
        console.debug(`${reason.name}가 Action에 의해서 올바르게 처리되었습니다.`);
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
        <SessionContext.Provider value={initSession()}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionContext.Provider>
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

function initSession(): SessionContext {
  // AccessTokenStorage
  const accessTokenStorage: AccessTokenStorage = new PrivatePropertyAccessTokenStorage();
  // 세션 관리자
  const sessionManager = new SessionManager(accessTokenStorage);
  // ApiRequest
  const request = new DefaultAxiosFactory(accessTokenStorage);

  return {
    sessionManager: sessionManager,
    api: request
  }
}

export interface SessionContext {
  sessionManager: SessionManager;
  api: DefaultAxiosFactory;
}