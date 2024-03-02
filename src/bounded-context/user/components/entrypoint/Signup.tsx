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
import { useApi } from "@/global/hook/useApi";
import { triggerToast } from "@/global/toast/ToastProvider";





export default function SignupTrigger({className}: {className?: string}){
  return (
  <div className={className}>
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="rounded-full">회원가입</Button>
      </DialogTrigger>
      {/* Dialog 팝업시에... */}
      <DialogContent>
        <SignupDialogForm />
      </DialogContent>
    </Dialog>
  </div>
  )
}


function SignupDialogForm(){
  const { api } = useApi();

  // Zod 스키마 정의
  const signupFormSchema = z.object({
    // username
    username: zodUserSchemata.username,

    // password
    passwordSchema: z.object({
      password: zodUserSchemata.password,
      passwordConfirm: z.string()
    })
    .refine(data => {return (data.password === data.passwordConfirm)}, 
    {
      message: "비밀번호 확인이 일치하지 않습니다.",
      path: ["passwordConfirm"]
    }),

    // email
    email: z.string().email(),

    // penname
    penname: zodUserSchemata.penname,
  })

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "testuser1",
      passwordSchema: {
        password: "testuser1",
        passwordConfirm: "testuser1",
      },
      email: "testuser1@pageflow.org",
      penname: "테스트유저일",
    },
  })

  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    const signupForm = {
      username: values.username,
      password: values.passwordSchema.password,
      email: values.email,
      penname: values.penname,
    }

    // 회원가입 요청 전송
    api.anonymous().post("/signup")
    .actions({
      DUPLICATED_USERNAME,
    })
    .data(signupForm)
    .fetch<void>();
  }

  return (
    <Form {...signupForm}>
      <form id="signup_form" onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-2">

        {/* username 필드 */}
        <FormField
          control={signupForm.control}
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
          control={signupForm.control}
          name="passwordSchema.password"
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

        {/* passwordConfirm 필드 */}
        <FormField
          control={signupForm.control}
          name="passwordSchema.passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" placeholder="passwordConfirm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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