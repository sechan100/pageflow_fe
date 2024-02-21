import { AccessToken, AccessTokenStorage, PrivatePropertyAccessTokenStorage } from "@/api/AccessTokenStorage";
import { create } from "zustand";
import { DefaultAxiosFactory as DefaultAxiosFactory } from "./AnonymousApi";
import { triggerToast } from "@/global/toast/ToastProvider";


/* AccessTokenStorage을 전역 싱글턴 인스턴스로 관리하기 위한 zustand store
 * 다만, 접근은 useAccessToken() 훅을 통해서만 한다. (export X)
 */
interface AccessTokenStore {
  storage: AccessTokenStorage;
}
const accessTokenStore = create<AccessTokenStore>((set) => ({
  storage: new PrivatePropertyAccessTokenStorage()
}));



const ensureValidAccessToken: () => Promise<string> = async () => {
  // 저장소 참조
  const { storage } = accessTokenStore();
  
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
   * 토큰 없음 -> refreshTokenUUID쿠키가 httpOnly이기 때문에 존재하는지 알 수 없음. 
   * 때문에 일단 존재한다고 전제하고 refresh 요청을 전송함. 안되면 toast로 "로그인 필요" 알림
   */
  } else {
    isRefreshRequired = true;
  }

  // [3]: accessToken이 없다면 refresh 요청을 보내고, 새로운 토큰을 받아옴
  if(isRefreshRequired){
    console.debug("refresh 요청 전송됨...");

    const accessToken: AccessToken = await DefaultAxiosFactory.anonymousPost("/refresh")
      .actions({
        TOKEN_NOT_FOUND: TOKEN_NOT_FOUND // refreshTokenUUID 쿠키가 없는 경우 -> 세션 없음
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


function TOKEN_NOT_FOUND(){
  triggerToast({
    title: "로그인이 필요합니다",
    action: {
      description: "로그인하러 가기",
      onClick: () => { console.log("로그인 페이지로 이동"); }
    }
  });
}



export default ensureValidAccessToken;