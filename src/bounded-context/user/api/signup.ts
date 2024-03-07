import { anonymousApi } from "@/global/api/anonymousApi";
import { triggerToast } from "@/global/provider/ToastProvider";





// signup 요청에 필요한 Request Body의 타입
interface SignupForm {
  username: string;
  password: string;
  email: string;
  penname: string;
  profileImgUrl: string | null;
}

const signup = async (form: SignupForm) => {
  // 회원가입 요청 전송
  await anonymousApi.post("/signup")
  .actions({
    DUPLICATED_USERNAME,
  })
  .data(form)
  .fetch<void>();

  // 회원가입 성공 시 -> 비동기 성공 반환
  Promise.resolve();
}


function DUPLICATED_USERNAME(){
  triggerToast({
    title: "이미 존재하는 아이디입니다.",
    action: {
      description: "로그인하러 가기",
      onClick: () => {console.log("로그인 페이지로 이동합니다.")}
    },
  })
}

export default signup;
export type { SignupForm };