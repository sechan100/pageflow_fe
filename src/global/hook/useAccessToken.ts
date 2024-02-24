import { AccessToken, AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "@/bounded-context/user/service/AccessTokenStorage";
import { create } from "zustand";
import { DefaultAxiosFactory } from "@/global/api/DefaultAxiosFactory";
import { triggerToast } from "@/global/toast/ToastProvider";
import { useAuth } from "./useAuth";
import { AsyncRequestBuilder } from "@/global/api/AsyncRequestBuilder";
import { useSession } from "./useSession";

/* AccessTokenStorage을 전역 싱글턴 인스턴스로 관리하기 위한 zustand store
 * 다만, 접근은 useAccessToken() 훅을 통해서만 한다. (export X)
 */
interface AccessTokenStore {
  storage: AccessTokenStorage
}
const useAccessTokenStore = create<AccessTokenStore>((set, get) => ({
  storage: new PrivatePropertyAccessTokenStorage()
}));

export const useAccessToken = () => {
  const { deAuthenticate, isAuthenticated } = useAuth(); // 인증상태 참조
  const { storage } = useAccessTokenStore(); // 저장소 참조

  const storeToken = (token: AccessToken) => {
    useAccessTokenStore.getState().storage.store(token);
  }

  const clearToken = () => {
    useAccessTokenStore.getState().storage.clear();
  }


  const ensureToken: () => Promise<string> = async () => {

    // [0]: root 인증상태 확인후, 익명이라면 에러
    if(!isAuthenticated()){ // 동기적 참조
      throw new Error("인증되지 않은 사용자는 'ensureToken()'으로 토큰을 가져올 수 없습니다.");
    }
    
    const isTokenExist: boolean = storage.isTokenExist();
    // [1]: 요청결정 변수: 해당 값을 최종확인하여, refresh 요청을 전송할지를 결정.
    let isRefreshRequired: boolean = false;
  
  
    // [2]: 토큰 상태 검증
    // 토큰 있음 => 만료여부 확인 
    if(isTokenExist){
      if(storage.isTokenExpired()){
        isRefreshRequired = true;
      }
    /**
     * 토큰 없음 -> isAuthentication이 true라면, refresh 요청을 보냄
     */
    } else {
      if(isAuthenticated()){
        isRefreshRequired = true;
      }
    }
  
    // [3]: accessToken이 없다면 refresh 요청을 보내고, 새로운 토큰을 받아옴
    if(isRefreshRequired){
      const request = new AsyncRequestBuilder(DefaultAxiosFactory.createDefaultAxiosInstance());

      const accessToken: AccessToken = await request.post("/user/refresh")
        .actions({
          TOKEN_NOT_FOUND, // refreshTokenUUID 쿠키가 없는 경우 -> 세션 없음
          SESSION_EXPIRED // refreshTokenUUID 쿠키가 있지만, 만료된 경우 -> 세션 만료
        })
        .fetch<AccessToken>();
  
      // 받아온 토큰 저장 후 반환.
      storage.store(accessToken);
      return accessToken.compact;
  
      // [4]: refresh 요청을 보내지 않고, 유효한 기존의 토큰을 그대로 반환
      } else {
        return storage.getToken();
      }
  }

  // CodeActions
  function TOKEN_NOT_FOUND(){
    deAuthenticate(); // root 인증상태 제거
    triggerToast({
      title: "로그인이 필요합니다",
      action: {
        description: "로그인하러 가기",
        onClick: () => { console.log("로그인 페이지로 이동"); }
      }
    });
  }

  function SESSION_EXPIRED(){
    deAuthenticate(); // root 인증상태 제거
    triggerToast({
      title: "만료된 세션입니다. 다시 로그인 해주세요.",
      action: {
        description: "로그인하러 가기",
        onClick: () => { console.log("로그인 페이지로 이동"); }
      }
    });
  }

  return {
    storeToken, 
    clearToken,
    ensureToken
  }
}

