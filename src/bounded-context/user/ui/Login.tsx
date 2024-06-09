'use client';
import { Button } from "@/shared/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/shadcn/dialog";
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
import OAuth2LoginWidget from "./OAuth2LoginWidget";
import { useSession } from "../hooks/useSession";
import { sessionApi } from "../api/sessionApi";



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

// form dialog
function LoginDialogForm(){
  const { login } = useSession();

  interface LoginForm {
    username: string;
    password: string;
  }
  
  const loginForm = useForm<LoginForm>({
    defaultValues: {
    username: "tuser1",
      password: "tuser1",
    }
  })

  // form 태그 제출시..
  const onSubmitRequest: (form: LoginForm) => void
  = async ({username, password}) => {
    const res = await sessionApi.formLogin(username, password);

    res.dispatch(b => b
      .success(accessToken => login(accessToken))
      .pop(3000, "아이디, 또는 비밀번호를 확인해주세요.")
    )
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