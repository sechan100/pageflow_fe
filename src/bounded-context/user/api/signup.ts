import { api } from "@/global/api/ApiBuilder";
import { SignupForm } from "../types/form";

const signup = async (form: SignupForm) => {
  // 회원가입 요청 전송
  await api()
  .anonymous()
  .post("/signup")
  .data(form)
  .fetch<void>();
  Promise.resolve();
}

export default signup;
export type { SignupForm };