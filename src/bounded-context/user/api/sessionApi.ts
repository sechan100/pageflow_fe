import { api } from "@/global/api/ApiBuilder"
import { AccessToken } from "../types/token"
import { ApiResponse } from "@/global/api/ApiResponse";



const formLogin: (username: string, password: string) => Promise<ApiResponse>
= async (username, password) => { 
  return await api()
    .anonymous()
    .post("/auth/login")
    .contentType("application/x-www-form-urlencoded")
    .data({username, password})
    .fetch()
}

const oauth2Login: (authorizationCodeUri: string) => Promise<ApiResponse>
= async (authorizationCodeUri) => {
  return await api()
  .anonymous()
  .get(authorizationCodeUri)
  .fetch();
}

const logout: () => Promise<ApiResponse>
= async () => {
  return await api()
  .authenticated()
  .post("/auth/session/logout")
  .fetch();
}


export const sessionApi = {
  formLogin,
  oauth2Login,
  logout
}