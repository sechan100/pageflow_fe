import { ApiFactory } from "@/apis/ApiFactory";
import { AccessTokenDto } from "./AccessTokenStorage";
import { TOAST_EVENT_NAME, triggerToast } from "@/libs/toast/ToastProvider";
import EventEmitter from "@/libs/event/EventEmitter";
import { Button } from "@/components/ui/button";


  /**
   * 쿠키에 저장된 refresh token을 사용해, 새로운 AccessToken을 발급받는다.
   */
export class AccessTokenRefresher {


  async refresh(): Promise<AccessTokenDto> {

    console.debug("AccessToken 재발급 요청 전송됨");

    return await ApiFactory.anonymousPost("/refresh")
    .actions({
      TOKEN_NOT_FOUND: TOKEN_NOT_FOUND
    })
    .fetch<AccessTokenDto>();
  }

}

// RefreshToken이 쿠키에 없음.
function TOKEN_NOT_FOUND() {
  triggerToast({
    description: "로그인이 필요합니다.",
    action: {
      description: "5초 만에 로그인하기!",
      onClick: () => { console.log("로그인 페이지로 이동"); }
    }
  });
}