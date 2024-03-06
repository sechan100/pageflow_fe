
/**
 * accessToken 저장소의 추상화.
 * 해당 객체의 생성과 관리는 오직 SessionManager에서만 이루어진다. 
 */
export interface AccessTokenStorage {
  store(accessToken: AccessToken): void;
  clear(): void;
  isTokenExist(): boolean;
  isTokenExpired(): boolean;
  getToken(): string;
}

export interface AccessToken {
  compact: string;
  expiredAt: number;
}


// private property에 토큰을 저장하는 방식
class PrivatePropertyAccessTokenStorage implements AccessTokenStorage {

  #compact: string | null = null;
  #expiredAt: number | null = null;

  // 새로운 토큰을 발급받았거나, 초기화했을 경우
  store(accessToken: AccessToken): void {
    if(!accessToken.compact || !accessToken.expiredAt){
      throw new Error("올바른 토큰 정보가 아닙니다.");
    }
    this.#compact = accessToken.compact;
    this.#expiredAt = accessToken.expiredAt;
  }

  // Storage를 비움
  clear(): void {
    this.#compact = null;
    this.#expiredAt = null;
  }

  // 토큰의 존재성을 확인
  isTokenExist(): boolean {
    return this.#compact ? true : false;
  }

  // 토큰의 만료 여부를 확인
  isTokenExpired(): boolean {
    if(!this.isTokenExist() || !this.#expiredAt){
      throw new Error("토큰이 존재하지 않습니다.");
    }
    return Date.now() > this.#expiredAt;
  }

  // 토큰을 반환
  getToken(): string {
    if(!this.#compact){
      throw new Error("AccessToken 존재하지 않습니다.");
    }
    return this.#compact;
  }




}


export { PrivatePropertyAccessTokenStorage }