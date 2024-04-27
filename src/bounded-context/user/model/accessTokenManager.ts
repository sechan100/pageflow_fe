import { popToast } from "@/global/provider/ToastProvider";
import { rootAuth } from "./rootAuth";
import { AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "./PrivatePropertyAccessTokenStorage";
import { AccessToken } from "../types/token";
import { api } from "@/global/api/ApiBuilder";


// AccessToken 저장소 인스턴스를 생성
const storage: AccessTokenStorage = new PrivatePropertyAccessTokenStorage();

// 실제 accessToken, refreshToken으로 표현되는 인증 상태를 rootAuth와 동기화하기 위해서 상태 업데이트 함수를 가져옴
const { isAuthenticated } = rootAuth;



/** 
 * 유효한 AccessToken을 반환한다. storage에 유효한 토큰을 캐싱중이라면 반환하고, 없다면 refresh를 시도한다. 
 */
const getValidAccessToken: () => Promise<string> 
= async () => {

  if(!isAuthenticated()){
    // rootAuth가 먼저임
    throw new Error("먼저 client 전역 인증상태를 변경해야합니다.");
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
  // 토큰 없음 -> refresh 요청을 보냄
  } else {
    isRefreshRequired = true;
  }

  // [3]: accessToken이 없다면 refresh 요청을 보내고, 새로운 토큰을 받아옴
  if(isRefreshRequired){
  
    // refresh 요청전송
    const res = await api()
      .anonymous()
      .post("/auth/session/refresh")
      .fetch<AccessToken>();

    // 받아온 토큰 저장 후 반환.
    storage.store(res.data);
    return res.data.compact;
  
    // [4]: refresh 요청을 보내지 않고, 유효한 기존의 토큰을 그대로 반환
  } else {
    return storage.getToken();
  }
}


export const accessTokenManager = {
  getValidAccessToken,

  storeToken: (token: AccessToken) => {
    storage.store(token);
  },

  clearToken: () => {
    storage.clear();
  },
}