import { AccessTokenRefresher } from "./AccessTokenRefresher";


/**
 * accessToken 저장소의 추상화.
 * 해당 객체의 생성과 관리는 오직 SessionManager에서만 이루어진다. 
 */
export interface AccessTokenStorage {
  store(accessTokenDto: AccessTokenDto): void;
  clear(): void;
  isTokenExist(): boolean;
  ensureValidToken(): Promise<string>;
}

export interface AccessTokenDto {
  accessToken: string;
  expiredAt: number;
}


// private property에 토큰을 저장하는 방식
class PrivatePropertyAccessTokenStorage implements AccessTokenStorage {

  #accessToken: string | null = null;
  #expiredAt: number | null = null;

  // 새로운 토큰을 발급받았거나, 초기화했을 경우
  store(accessTokenDto: AccessTokenDto): void {
    if(!accessTokenDto.accessToken || !accessTokenDto.expiredAt){
      throw new Error("올바른 토큰 정보가 아닙니다.");
    }
    this.#accessToken = accessTokenDto.accessToken;
    this.#expiredAt = accessTokenDto.expiredAt;
  }

  // Storage를 비움
  clear(): void {
    this.#accessToken = null;
    this.#expiredAt = null;
  }

  // 토큰의 존재성을 확인
  isTokenExist(): boolean {
    return this.#accessToken && true || false;
  }

  // 반드시 유효한 토큰을 반환할 것을 보장한다. 문제가 발생하면 에러를 던진다.
  async ensureValidToken(): Promise<string> {

    let isRefreshRequired = false;

    // 1.토큰 X
    if(!this.isTokenExist()){
      isRefreshRequired = true;

    // 2. 토큰 O
    } else {
      // 근데 만료된 경우
      if(this.isTokenExpired()){
        isRefreshRequired = true;
      }
    }

    // 리프레시!
    if(isRefreshRequired){
      await this.refreshAndStore();
    }
    
    // 토큰이 존재한다면 반환
    if(this.#accessToken){
      return Promise.resolve(this.#accessToken);
    // 토큰이 없다면 에러
    } else {
      return Promise.reject("저장된 토큰이 없습니다.");
    }
  }

  // 토큰의 만료 여부를 확인
  private isTokenExpired(): boolean {
    if(!this.isTokenExist() || !this.#expiredAt){
      throw new Error("토큰이 존재하지 않습니다.");
    }
    return Date.now() > this.#expiredAt;
  }

  // 토큰을 새로 발급받음.
  private async refreshAndStore(): Promise<string> {
    const accessTokenDto = await new AccessTokenRefresher().refresh()
    this.store(accessTokenDto);
    return accessTokenDto.accessToken;
  }




}


export { PrivatePropertyAccessTokenStorage }