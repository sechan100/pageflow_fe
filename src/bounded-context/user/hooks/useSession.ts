import { rootAuth } from "../model/rootAuth";
import { useState } from "react";
import { AccessToken } from "../types/token";
import { accessTokenManager } from "../model/accessTokenManager";
import { useSessionQuery } from "../api/useSessionQuery";
import { create } from "zustand";


const { authenticate, deAuthenticate } = rootAuth;
const { storeToken, clearToken } = accessTokenManager;

export interface IUseSession {
  isAuthenticated: boolean;
  login: (accessToken: AccessToken) => Promise<void>;
  logout: () => Promise<void>;
  session: ReturnType<typeof useSessionQuery>["data"];
  isSessionLoading: ReturnType<typeof useSessionQuery>["isLoading"];
}

interface IAuthenticationStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// ZUSTAND
const useAuthenticationStore = create<IAuthenticationStore>(set => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({isAuthenticated})
}));

export const useSession: () => IUseSession
= () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthenticationStore();

  const sessionQuery = useSessionQuery(isAuthenticated);
  
  // 로그인
  const login = async (accessToken : AccessToken) => {
    authenticate();
    storeToken(accessToken);
    // 상태 업데이트 -> useQuery의 세션 정보 캐싱을 트리거
    setIsAuthenticated(true);
  }

  // 로그아웃
  const logout = async () => {
    deAuthenticate();
    clearToken();
    sessionQuery.remove();
    setIsAuthenticated(false);
  }

  return {
    isAuthenticated, // 인증상태(Zustand)
    login, // 로그인
    logout, // 로그아웃
    session: sessionQuery.data, // 세션 정보
    isSessionLoading: sessionQuery.isLoading, // 세션 정보 로딩 상태
  }
};