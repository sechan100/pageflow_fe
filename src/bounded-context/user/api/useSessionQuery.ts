import { api } from "@/global/api/ApiBuilder";
import { UseQueryResult, useQuery } from "react-query";
import { Session } from "../types/session";



const queryFn = async () => {
  const res = await api()
  .authenticated()
  .get("/auth/session/info")
  .fetch();

  if(res.code === 2000){
    return res.data as Session;
  } else {
    return Promise.reject(res);
  }
}


/**
 * 세션 정보를 가져오는 useQuery
 * 반드시 authenticated 상태에서 호출 가능
 */
export const useSessionQuery: (isAuthedState: boolean) => UseQueryResult<Session, unknown>
= (isAuthenticated) => {
  return useQuery<Session>({
    queryKey: "session-info",
    queryFn: queryFn,
    enabled: isAuthenticated
  });
}