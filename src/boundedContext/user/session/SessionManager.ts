import { AccessTokenDto, AccessTokenStorage } from "@/bounded-context/user/session/AccessTokenStorage";
import deepFreeze from "@/libs/freeze";


// Client Side Session 정의
interface ClientSession {
  user: {
    id: number;
    email: string;
    username: string;
    penname: string;
  };
}

// AccessTokenStorage를 관리하고, 세션과 관련한 활동들을 중앙집권적으로 처리한다.
export class SessionManager {

  // Properties
  #accessTokenStorage: AccessTokenStorage
  #session : ClientSession | null;

  // 생성자
  constructor(accessTokenStorage: AccessTokenStorage) {
    this.#accessTokenStorage = accessTokenStorage;
    this.#session = null;
  }


  isAuthenticated(): boolean {
    return this.#session !== null;
  }

  setSession(session: ClientSession) {
    // session 데이터를 불변 객체로 만들기 위해서 동결
    this.#session = deepFreeze(session);
  }

  getSession(): ClientSession | null {
    return this.#session;
  }

  clearSession(): void {
    this.#session = null;
  }

  saveToken(accessTokenDto: AccessTokenDto){
    this.#accessTokenStorage.save(accessTokenDto);
  }
}