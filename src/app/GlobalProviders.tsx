'use client';

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SessionManager } from "@/session/SessionManager";
import { Request } from "@/api/request";
import { AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "@/session/AccessTokenStorage";
import { AxiosInstance } from "axios";
import { createContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";



const queryClient = reactQueryConfig();

const session = sessionManagerConfig()
export const sessionContext = createContext<SessionContext>(session);




export default function GlobalProviders({children} : {children: React.ReactNode}){
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <sessionContext.Provider value={session}>
          {children}
        </sessionContext.Provider>
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

function sessionManagerConfig(): SessionContext{
  // AccessTokenStorage
  const accessTokenStorage: AccessTokenStorage = new PrivatePropertyAccessTokenStorage();
  // 세션 관리자
  const sessionManager = new SessionManager(accessTokenStorage);
  // ApiRequest
  const request = new Request(accessTokenStorage);

  return {
    sessionManager: sessionManager,
    api: request.api()
  }
}
export interface SessionContext {
  sessionManager: SessionManager;
  api: AxiosInstance;
}