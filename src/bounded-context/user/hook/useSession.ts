import { useQuery } from "react-query";
import { QueryKeys } from "../constants/query-key/ReactQueryKey";
import { useApi } from "@/global/hook/useApi";
import { useRootAuth } from "../../../global/hook/useRootAuth";


// 클라이언트 세션에 저장될 사용자 정보
export interface UserSession{
  id: number;
  email: string;
  username: string;
  penname: string;
}


interface ServerSession {
  user: UserSession;
}

export interface ClientSession {
  isAuthenticated: boolean;
  user: UserSession | null;
}



export const useSession = () => {

  const { api, apiCode } = useApi();
  const { isAuthenticated } = useRootAuth();
  const queryKey = QueryKeys.user.session;
  const queryFn = () => api.get("/user/session").actions({}).fetch<ServerSession>();
  const options = {
    enabled: isAuthenticated, // 인증된 사용자만 세션 정보를 가져옴
  }

  // [1]: useQuery를 사용하여 세션 정보를 가져오고 캐싱, 반환
  const useQueryResult = useQuery<ServerSession>(queryKey, queryFn, options);

  // ServerSession 타입을 ClientSession 타입으로 변환
  const session = useQueryResult.data ? convert(useQueryResult.data) : anonymousSession();

  return {
    session,
    apiCode,
    useQueryResult
  }
}

const convert = (serverSession: ServerSession): ClientSession => {  
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