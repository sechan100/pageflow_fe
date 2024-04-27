import { api } from "@/global/api/ApiBuilder"
import { AccessToken } from "../types/token"
import { ApiResponse } from "@/global/api/types/apiTypes";



const formLoginApi: (username: string, password: string) => Promise<ApiResponse<AccessToken>>
= async (username: string, password: string) => { 
  return await api()
    .anonymous()
    .post("/auth/login")
    .contentType("application/x-www-form-urlencoded")
    .data({username, password})
    .fetch<AccessToken>()
}

// const oauth2Login: (provider: string) => Promise<AccessToken>
//  = async (provider: string) => {
//   const accessToken = await api()
//   .anonymous()
//   .get(authorizationCodeUri)
//   .addAction(OAUTH2_SIGNUP_REQUIRED, (res) => router.push("/signup/oauth2", {signupCache: res.data}))
//   .fetch<AccessToken>();
// }

const logoutApi: () => Promise<ApiResponse<void>>
= async () => {
  return await api()
  .authenticated()
  .post("/auth/session/logout")
  .fetch<void>();
}


export {
  formLoginApi,
  // oauth2Login,
  logoutApi
}