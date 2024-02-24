'use client';
import { create } from "zustand";
import { triggerToast } from "../toast/ToastProvider";

export const SESSION_FLAG_NAME = "_pageflowSessionExpiredAt" as const;

function isAuthenticated(){
  if(!isClient()) {
    return false;
  }

  const sessionFlag = getLocalStorage().getItem(SESSION_FLAG_NAME);

  // [1]: 세션지표가 존재하지 않는 경우 -> refreshToken 쿠키는 존재할 수도 있지만, 모르겠고 그냥 세션 없는걸로 간주
  if(sessionFlag) {
    return false;
  }

  // [2]: 세션지표가 존재하지만, 만료된 경우 -> 세션 없음
  const isSessionExpired = Number(sessionFlag) < Date.now();
  if(isSessionExpired) {
    return false;
  }

  // [3]: 세션지표가 존재하고, 만료되지 않은 경우 -> 세션 있음
  return true;
}

function login(){
  if(!isClient()) {
    triggerToast({
      title: "로그인할 수 없습니다.",
      description: "잠시후에 다시 시도해주세요.",
      variant: "destructive"
    })
    return;
  }

  const expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
  localStorage.setItem(SESSION_FLAG_NAME, String(expiredAt));
}

function logout(){
  if(!isClient()) {
    triggerToast({
      title: "로그아웃할 수 없습니다.",
      description: "잠시후에 다시 시도해주세요.",
      variant: "destructive"
    })
    return;
  }

  localStorage.removeItem(SESSION_FLAG_NAME);
}

function getLocalStorage(): Storage {
  return window.localStorage;
}

function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export interface RootAuth {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useRootAuth = create<RootAuth>((set, get) => ({
  isAuthenticated: isAuthenticated(),

  login: () => {
    login();
    set({ isAuthenticated: true });
  },

  logout: () => {
    logout();
    set({ isAuthenticated: false });
  }
}));