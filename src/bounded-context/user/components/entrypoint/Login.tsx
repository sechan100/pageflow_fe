'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodUserSchemata } from "@/bounded-context/user/constants/zod/UserSchemata";
import { AccessToken } from "../../service/AccessTokenStorage";
import { useApi } from "@/global/hook/useApi";
import { useAuth } from "@/global/hook/useAuth";
import { triggerToast } from "@/global/toast/ToastProvider";
import { useRootAuth } from "@/global/hook/useRootAuth";


export default function LoginTrigger({className}: {className?: string}){
  return (
  <div className={className}>
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="rounded-full">로그인</Button>
      </DialogTrigger>
      {/* Dialog 팝업시에... */}
      <DialogContent>
        <LoginDialogForm />
      </DialogContent>
    </Dialog>
  </div>
  )
}

function LoginDialogForm(){

  const { api } = useApi();
  const { storeToken } = useAuth();
  const { login } = useRootAuth();
  
  const loginFormSchema = z.object({
    username: zodUserSchemata.username,
    password: zodUserSchemata.password
  })
  
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "testuser1",
      password: "testuser1",
    },
  })
  
  async function onSubmit(UnAndPw: z.infer<typeof loginFormSchema>) {
    //TODO: api에서 데이터 타입만 제네릭으로 전달하면, 알아서 객체를 처리해서 타입에 맞게 반환해주는 중앙화 로직 구현하기
    const accessToken = await api
                              .anonymous()
                              .post("/login")
                              .actions({
                                USER_NOT_FOUND
                              })
                              .data(UnAndPw)
                              .fetch<AccessToken>();
    // 토큰 저장
    storeToken(accessToken);
    login();
  }


  return (
    <Form {...loginForm}>
      <form id="login_form" onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-2">

        {/* username 필드 */}
        <FormField
          control={loginForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">아이디</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password 필드 */}
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <Button form="login_form" type="submit" className="rounded-full">로그인</Button>
    </Form>
  )
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