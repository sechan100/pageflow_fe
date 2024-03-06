'use client';
import { create } from "zustand";
import { triggerToast } from "../../../global/provider/ToastProvider";

export const SESSION_FLAG_NAME = "_pageflowSessionExpiredAt" as const;

function getAuthStateFromLocalStorage(){
  const isAuthenticated = continueIfOnServer(() => {
    const sessionFlag = localStorage.getItem(SESSION_FLAG_NAME);

    // [1]: 세션지표가 존재하지 않는 경우 -> refreshToken 쿠키는 존재할 수도 있지만, 모르겠고 그냥 세션 없는걸로 간주
    if(!sessionFlag) {
      return false;
    }
    
    // [2]: 세션지표가 존재하지만, 만료된 경우 -> 세션 없음
    const isSessionExpired = Number(sessionFlag) < Date.now();
    if(isSessionExpired) {
      return false;
    }
    
    // [3]: 세션지표가 존재하고, 만료되지 않은 경우 -> 세션 있음
    return true;
  })
  console.debug("LocalStorage에서 ROOT 인증상태를 불러옴: ", isAuthenticated);
  return isAuthenticated;
}

function localStorageAuthenticate(){
  continueIfOnServer(() => {
    const expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
    localStorage.setItem(SESSION_FLAG_NAME, String(expiredAt));
  })
}

function localStorageDeAuthenticate(){
  continueIfOnServer(() => localStorage.removeItem(SESSION_FLAG_NAME))
}


function continueIfOnServer(callback: any){
  while(typeof window !== "undefined" && typeof window.localStorage !== "undefined"){
    return callback();
  }
}

export interface RootAuth {
  isAuthenticated: () => boolean; // root 인증상태를 동기적으로 반환하기위해 함수로 정의함
  authenticate: () => void;
  deAuthenticate: () => void;
  rootAuth: boolean;
}

export const useAuth = create<RootAuth>((set, get) => ({
  isAuthenticated: () => {
    return get().rootAuth;
  },

  authenticate: () => {
    localStorageAuthenticate();
    set({ rootAuth: true });
  },

  deAuthenticate: () => {
    localStorageDeAuthenticate();
    set({ rootAuth: false });
  },

  rootAuth: getAuthStateFromLocalStorage()
}));