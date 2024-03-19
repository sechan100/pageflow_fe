import { create } from "zustand";
import { rootAuth } from "../modules/rootAuth";
import { anonymousApi } from "@/global/api/anonymousApi";
import { AccessToken } from "../class/PrivatePropertyAccessTokenStorage";
import { accessTokenManager } from "../class/accessTokenManager";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "@/global/constants/queryKeys";
import { triggerToast } from "@/global/provider/ToastProvider";
import { useRouting } from "@/global/hook/useRouting";
import { api } from "@/global/api/api";


// 세션에 포함되는 사용자 정보 타입
interface SessionUser {
  id: number;
  email: string;
  username: string;
  penname: string;
  profileImgUrl: string;
  role: "ROLE_USER" | "ROLE_MANAGER" |"ROLE_ADMIN";
  isEmailVerified: boolean;
}
// 세션 타입
interface Session {
  user: SessionUser;
}
interface UseSessionStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}


const { isAuthenticated, authenticate, deAuthenticate } = rootAuth;
const { storeToken, clearToken } = accessTokenManager;

const useSessionStore = create<UseSessionStore>((set) => ({
  isAuthenticated: isAuthenticated(), // 최초 초기화는 rootAuth로부터 가져옴
  setIsAuthenticated: (isAuthenticated) => set({isAuthenticated}),
}));


// useSession 훅
const useSession = () => {
  const { isAuthenticated, setIsAuthenticated } = useSessionStore();
  const { router } = useRouting();

  // useQuery
  const sessionQueryResult = useQuery<Session>(
    // queryKey
    [queryKeys.user.session], 
    // queryFn
    () => { 
      return api
      .get("/user/session")
      .actions({})
      .fetch<Session>() 
    }, 
    // options
    { enabled: isAuthenticated }
  );

  // form 로그인
  const formLogin = async (username: string, password: string) => {
    const accessToken = await anonymousApi
    .anonymous()
    .post("/login")
    .actions({
      USER_NOT_FOUND,
    })
    .data({username, password})
    .fetch<AccessToken>();

    // (1): root 인증상태 -> 인증
    authenticate();
    // (2): accessToken 저장
    storeToken(accessToken);
    // (3): 세션 정보 캐싱
    // useSession()훅에서 알아서 서버 요청하고 캐싱할거임.
    // (4): 상태 업데이트
    setIsAuthenticated(true);
  }

  // oauth2 로그인
  const oauth2Login = async (authorizationCodeUri: string) => {
    const accessToken = await anonymousApi
    .get(authorizationCodeUri)
    .actions({
      OAUTH2_SIGNUP_REQUIRED: (userData) => {
        router.push("/signup/oauth2", {signupCache: userData})
      }
    })
    .fetch<AccessToken>();
        
    // (1): root 인증상태 -> 인증
    authenticate();
    // (2): accessToken 저장
    storeToken(accessToken);
    // (3): 세션 정보 캐싱
    // useSession()훅에서 알아서 서버 요청하고 캐싱할거임.
    // (4): 상태 업데이트
    setIsAuthenticated(true);
  }

  // 로그아웃
  const logout = async () => {
    // 서버에 로그아웃 요청을 전송 -> 서버에서 RefreshToken을 제거하고, refreshTokenUUID 쿠키를 제거.
    await anonymousApi
      .post("/session/logout")
      .actions({SUCCESS: logoutSuccess})
      .fetch<void>();

    function logoutSuccess(){
      // (1): root 인증상태 -> 익명
      deAuthenticate();
      // (2): accessToken 제거
      clearToken();
      // (3): session 정보 제거
      sessionQueryResult.remove();
      // (4): 상태 업데이트
      setIsAuthenticated(false);
    }
  }

  function USER_NOT_FOUND(){
    triggerToast({
      title: "존재하지 않는 사용자입니다.",
      action: {
        description: "회원가입하러 가기",
        onClick: () => {console.log("회원가입 페이지로 이동합니다.")}
      },
    })
  }

  return {
    isAuthenticated, // 인증상태(Zustand)
    formLogin, // 폼 로그인
    oauth2Login, // oauth2 로그인
    logout, // 로그아웃
    session: sessionQueryResult.data, // 세션 정보
    isSessionLoading: sessionQueryResult.isLoading, // 세션 정보 로딩 상태
  }
};


export { useSession };
export type { Session, SessionUser };
