import { useQuery } from "react-query";
import { QueryKeys } from "../../bounded-context/user/constants/query-key/ReactQueryKey";
import { useApi } from "@/global/hook/useApi";
import { useAuth } from "./useAuth";
import { useAccessToken } from "@/global/hook/useAccessToken";
import { AccessToken } from "@/bounded-context/user/service/AccessTokenStorage";
import { triggerToast } from "../toast/ToastProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useRouting } from "./useRouting";


// 세션에 포함되는 사용자 정보 타입
export interface UserSession{
  id: number;
  email: string;
  username: string;
  penname: string;
  profileImgUrl: string;
  role: "ROLE_USER" | "ROLE_MANAGER" |"ROLE_ADMIN";
  isEmailVerified: boolean;
}

// 서버 api에서 반환하는 세션 타입
interface ServerSession {
  user: UserSession;
}
// FE에서 실제로 사용될 세션 타입
export interface ClientSession {
  isAuthenticated: boolean;
  user: UserSession | null;
}



interface UseSessionResult{
  session: ClientSession;
  formLogin: (username: string, password: string) => void;
  oauth2Login: (url: string) => void;
  logout: () => void;
}

export const useSession: () => UseSessionResult = () => {

  const { api } = useApi();
  const { isAuthenticated, authenticate, deAuthenticate } = useAuth();
  const { storeToken, clearToken } = useAccessToken();
  const { router } = useRouting();

  // [1]: react-query로 세션정보를 가져오고 캐싱
  const queryFn = () => api.get("/user/session").actions({}).fetch<ServerSession>();
  const options = {
    enabled: isAuthenticated(), // 인증된 사용자만 세션 정보를 가져옴
  }
  // useQuery를 사용하여 세션 정보를 가져오고 캐싱후 반환
  const useQueryResult = useQuery<ServerSession>(QueryKeys.user.session, queryFn, options);
  // ServerSession 타입을 ClientSession 타입으로 변환
  const session = useQueryResult.data ? convertToClient(useQueryResult.data) : anonymousSession();


  // [2]: formLogin 로직 생성
  const formLogin = async (username: string, password: string) => {
    const accessToken = await api
        .anonymous()
        .post("/login")
        .actions({
          USER_NOT_FOUND,
        })
        .data({username, password})
        .fetch<AccessToken>();
        
    // root 인증상태를 설정
    authenticate();
    // 토큰 저장
    storeToken(accessToken);
  }

  // [3]: oauth2Login 로직 생성
  const oauth2Login = async (url: string) => {
    const accessToken = await api
        .anonymous()
        .get(url)
        .actions({
          OAUTH2_SIGNUP_REQUIRED,
        })
        .fetch<AccessToken>();
        
    // root 인증상태를 설정
    authenticate();
    // 토큰 저장
    storeToken(accessToken);
  }


  // c.f.h: 로그아웃 로직 보충하기 -> 서버에 로그아웃 요청을 전송해서, RefreshToken을 제거하고, refreshTokenUUID 쿠키를 제거.

  // [4]: logout 로직 생성
  const logout = async () => {
    // 서버에 로그아웃 요청을 전송 -> 서버에서 RefreshToken을 제거하고, refreshTokenUUID 쿠키를 제거.
    await api.post("/session/logout").actions({SUCCESS: logoutSuccess}).fetch<void>();

    function logoutSuccess(){
      // [3-1]: root 인증 상태를 제거
      deAuthenticate();
      // [3-2]: session 정보 제거
      useQueryResult.remove();
      // [3-3]: accessToken 제거
      clearToken();
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

  function OAUTH2_SIGNUP_REQUIRED(userData: any){
    router.push("/signup/oauth2", {signupCache: userData});
  }

  return {
    session,
    formLogin,
    oauth2Login,
    logout,
  }
}

const convertToClient = (serverSession: ServerSession): ClientSession => {  
  return {
    isAuthenticated: true,
    user: serverSession.user,
  }
}

const anonymousSession = (): ClientSession => {
  return {
    isAuthenticated: false,
    user: null,
  }
}
