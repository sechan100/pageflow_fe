import { api } from "@/global/api/ApiBuilder";
import { SignupForm } from "../types/form";
import { ApiResponse } from "@/global/api/types/apiTypes";

const signupApi: (form: SignupForm) => Promise<ApiResponse<void>>
= async (form: SignupForm) => {
  // 회원가입 요청 전송
  return await api()
  .anonymous()
  .post("/signup")
  .data(form)
  .fetch<void>();
}

export { signupApi };