'use client';

import { zodUserSchemata } from "@/bounded-context/user/constants/zod/UserSchemata";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApi } from "@/global/hook/useApi";
import { triggerToast } from "@/global/toast/ToastProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouting } from "@/global/hook/useRouting";




export default function OAuth2SignupForm(){
  const { api } = useApi();
  const { getUrlState } = useRouting();

  // 라우팅으로 같이 넘어온 데이터가 존재하지 않음 -> 라우팅을 통한 접근이 아니므로 에러
  if(!getUrlState().signupCache){
    throw new Error("url state가 존재하지 않습니다.");
  }
  const signupCache = getUrlState().signupCache;

  // Zod 스키마 정의
  const signupFormSchema = z.object({
    // email
    email: z.string().email(),
    // penname
    penname: zodUserSchemata.penname,
  })

  // form 객체 생성
  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: signupCache.email,
      penname: signupCache.penname,
    },
  })

  // 제출 이벤트 콜백
  function onSubmit(values: z.infer<typeof signupFormSchema>){
    // Post 요청에 담을 객체를 생성
    const requestBody = {
      username: signupCache.username,
      password: signupCache.password,
      email: values.email,
      penname: values.penname,
      profileImgUrl: signupCache.profileImgUrl,
    }
    // 회원가입 요청 전송
    api.anonymous().post("/signup")
    .actions({
      DUPLICATED_USERNAME,
    })
    .data(requestBody)
    .fetch<void>();
  }

  return (
    <Form {...signupForm}>
      <form id="signup_form" onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-2">
        {/* email 필드 */}
        <FormField
          control={signupForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">이메일</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* penname 필드 */}
        <FormField
          control={signupForm.control}
          name="penname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">필명</FormLabel>
              <FormControl>
                <Input type="penname" placeholder="penname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <Button form="signup_form" type="submit" className="rounded-full">회원가입</Button>
    </Form>
  )
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