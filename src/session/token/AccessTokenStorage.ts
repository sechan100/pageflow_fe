

/**
 * accessToken 저장소의 추상화.
 * 해당 객체의 생성과 관리는 오직 SessionManager에서만 이루어진다. 
 */
export interface AccessTokenStorage {
  save(accessTokenDto: AccessTokenDto): void;
  getToken(): string | null;
  clearToken(): void;
  isTokenExist(): boolean;
}

export interface AccessTokenDto{
  accessToken: string;
  expiredAt: number;
}


// private property에 토큰을 저장하는 방식
class PrivatePropertyAccessTokenStorage implements AccessTokenStorage {

  #accessToken: string | null = null;
  #expiredAt: number | null = null;

  // 새로운 토큰을 발급받았거나, 초기화했을 경우
  save(accessTokenDto: AccessTokenDto): void {
      this.#accessToken = accessTokenDto.accessToken;
      this.#expiredAt = accessTokenDto.expiredAt;
  }

  getToken(): string | null {
    return this.#accessToken;
}

  clearToken(): void {
    this.#accessToken = null;
  }

  isTokenExist(): boolean {
    return this.#accessToken && true || false;
  }

}


export { PrivatePropertyAccessTokenStorage }