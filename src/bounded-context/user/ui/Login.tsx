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
import OAuth2LoginWidget from "./OAuth2LoginWidget";
import { useSession } from "../hooks/useSession";
import { sessionApi } from "../api/sessionApi";
import { ApiResponse } from "@/global/api/types/apiTypes";
import { AccessToken } from "../types/token";
import { useState } from "react";
import { FieldErrorMessage } from "@/shared/components/custom/fieldErrorMessage";


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
        <OAuth2LoginWidget />
      </DialogContent>
    </Dialog>
  </div>
  )
}

function LoginDialogForm(){
  const { login } = useSession();
  const [code, setCode] = useState<number>(0);

  interface LoginForm {
    username: string;
    password: string;
  }
  
  const loginForm = useForm<LoginForm>({
    defaultValues: {
    username: "sechan100",
      password: "sechan100",
    }
  })

  const onSubmitRequest: (form: LoginForm) => void
  = async ({username, password}) => {
    const res = await sessionApi.formLogin(username, password);
    res.match(
    {
      success: ({data}) => login(data),
      default: ({code}) => {setCode(code)}
    })
  }

  return (
    <Form {...loginForm}>
      <form id="login_form" onSubmit={loginForm.handleSubmit((form) => onSubmitRequest(form))} className="space-y-2">

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
              <FieldErrorMessage when={code == 3000}>아이디를 확인해주세요</FieldErrorMessage>
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
              <FieldErrorMessage when={code == 4100}>비밀번호가 일치하지 않습니다</FieldErrorMessage>
            </FormItem>
          )}
        />
      </form>
      <Button form="login_form" type="submit" className="rounded-full">로그인</Button>
    </Form>
  )
}