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
import { useAccessToken } from "@/global/hook/useAccessToken";
import { triggerToast } from "@/global/toast/ToastProvider";
import { useAuth } from "@/global/hook/useAuth";
import { useSession } from "@/global/hook/useSession";
import OAuth2LoginWidget from "./OAuth2LoginWidget";


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

  const { formLogin: login } = useSession();
  
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


  return (
    <Form {...loginForm}>
      <form id="login_form" onSubmit={loginForm.handleSubmit(
        ({username, password}) => {
          // form 제출 시 로그인 함수 실행
          login(username, password);
        }
      )} className="space-y-2">

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