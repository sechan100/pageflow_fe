import { AccessToken, AccessTokenStorage } from "../api/AccessTokenStorage";
import { create } from "zustand";




// 현재 Client 세션의 Zustand 상태
interface SessionStore {
  session: ClientSession;
  setSession: (session: ClientSession) => void;
}

const sessionStore = create<SessionStore>((set) => ({
  session: {
    isAuthenticated: false,
    user: null,
  },
  setSession: (session: ClientSession) => set({ session }),
}));

// AccessTokenStorage를 관리하고, 세션과 관련된 동작을 중앙화.
export class SessionManager {

  // Properties
  #accessTokenStorage: AccessTokenStorage
  #sessionStore: SessionStore;

  // 생성자
  constructor(accessTokenStorage: AccessTokenStorage) {
    this.#accessTokenStorage = accessTokenStorage;
    this.#sessionStore = sessionStore();
  }


  isAuthenticated(): boolean {
    return this.#accessTokenStorage.isTokenExist() && this.#sessionStore.session.isAuthenticated;
  }

  setSession(session: ClientSession) {
    // session 데이터를 불변 객체로 동결
    this.#sessionStore.setSession(session)
  }

  getSession(): ClientSession {
    return this.#sessionStore.session;
  }

  clearSession(): void {
    this.#sessionStore.setSession({
      isAuthenticated: false,
      user: null,
    });
  }

  storeToken(accessToken: AccessToken){
    this.#accessTokenStorage.store(accessToken);
  }
}