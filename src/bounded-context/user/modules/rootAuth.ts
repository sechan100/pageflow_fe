



const SESSION_FLAG_NAME = "pageflowSessionExpiredAt" as const;
// 클라이언트 환경에서만 콜백을 실행하도록 해줌
const _ifOnClient = (callback: any) => {
  while(typeof window !== "undefined" && typeof window.localStorage !== "undefined"){
    return callback();
  }
}

// 로컬 스토리지에서 'rootAuth' 인증상태를 로드
let isRootAuthed = _ifOnClient(() => {
  const sessionFlag = localStorage.getItem(SESSION_FLAG_NAME);
  const isSessionExpired = Number(sessionFlag) < Date.now();

  let rootAuth;

  // [1]: 세션지표가 존재하지 않는 경우 -> refreshToken 쿠키는 존재할 수도 있지만, 모르겠고 그냥 세션 없는걸로 간주
  if(!sessionFlag) {
    rootAuth = false;
  }
  
  // [2]: 세션지표가 존재하지만, 만료된 경우 -> 세션 없음
  else if(isSessionExpired) {
    rootAuth = false;
  }
  
  // [3]: 세션지표가 존재하고, 만료되지 않은 경우 -> 세션 있음
  else if(sessionFlag && !isSessionExpired) {
    rootAuth = true;
  }
  
  // 반환
  console.debug("LocalStorage에서 ROOT 인증상태를 로드: ", rootAuth);
  return rootAuth;
})



export const rootAuth = { 

  isAuthenticated: () => isRootAuthed,

  authenticate: () => {
    _ifOnClient(() => {
      const expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
      localStorage.setItem(SESSION_FLAG_NAME, String(expiredAt));
    })
    isRootAuthed = true;
  },

  deAuthenticate: () => {
    _ifOnClient(() => localStorage.removeItem(SESSION_FLAG_NAME))
    isRootAuthed = false;
  } 
};