import { api } from "@/global/api/ApiBuilder";
import { ApiResponse } from "@/global/api/ApiResponse";

export interface SignupForm {
  username: string;
  password: string;
  email: string;
  penname: string;
  profileImgUrl: string | null;
}
const signup: (form: SignupForm) => Promise<ApiResponse>
= async (form: SignupForm) => {
  // 회원가입 요청 전송
  return await api()
  .anonymous()
  .post("/signup")
  .data(form)
  .fetch();
}

export const signupApi = {
  signup,
};