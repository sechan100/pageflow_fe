import { FormItem } from "@/components/ui/form";
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
  api.anonymous().post("/signup")
  .actions({
    DUPLICATED_USERNAME,
  })
  .data(form)
  .fetch<void>();
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