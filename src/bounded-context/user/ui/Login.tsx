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
import { formLoginApi } from "../api/sessionApi";



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
    const res = await formLoginApi(username, password);

    res.dispatch(builder => builder
      .success(data => login(data))
      .defaultWithToast()
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