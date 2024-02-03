'use client';

import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "react-query";




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

export default function GlobalProviders({children} : {children: React.ReactNode}){
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
}
