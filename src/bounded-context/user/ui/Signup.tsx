'use client';

import { Button } from "@/shared/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/shadcn/dialog";
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
} from "@/shared/components/shadcn/form"
import { Input } from "@/shared/components/shadcn/input"
import { zodUserSchemata } from "@/bounded-context/user/shared/UserSchemata";
import { SignupForm, signupApi } from "../api/signup";
import { popToast } from "@/global/provider/ToastProvider";
import { useState } from "react";
import { FieldError } from "@/global/api/commonResponseTypes";






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

  const onSubmitRequest = async (values: z.infer<typeof signupFormSchema>) => {
    const requestForm: SignupForm = {
      username: values.username,
      password: values.passwordSchema.password,
      email: values.email,
      penname: values.penname,
      profileImgUrl: null
    }
    // 회원가입 요청 전송
    const res = await signupApi.signup(requestForm);
    res.dispatch(b => b
      .when(4100, (res) => {
        res.data.errors.forEach(
          (error: FieldError) => signupForm.setError(
            // @ts-ignore
            error.field, { type: "manual", message: error.message}
          )
        )
      })
      .success(() => {
        popToast({
          title: "회원가입 성공",
          description: "회원가입이 완료되었습니다.",
        })
      })
    )
  }

  return (
    <Form {...signupForm}>
      <form id="signup_form" onSubmit={signupForm.handleSubmit(onSubmitRequest)} className="space-y-2">

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