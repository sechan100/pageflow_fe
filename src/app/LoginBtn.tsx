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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";


export default function LoginBtn({className} : {className?: string}){
  return (
  <div className={className}>
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="rounded-full">로그인</Button>
      </DialogTrigger>

      {/* Dialog 팝업시에... */}
      <DialogContent>
        <FormComponent />
      </DialogContent>
    </Dialog>
  </div>
  )
}


function FormComponent(){


  const loginFormSchema = z.object({
    username: z.string()
    .min(1, "아이디를 입력해주세요.")
    .min(4, "아이디를 4자 이상으로 입력해주세요.")
    .max(100, "아이디가 너무 깁니다.")
    .regex(/^[-a-zA-Z0-9]+$/, "아이디는 영문과 숫자만을 사용할 수 있습니다."),

    password: z.string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호를 8자 이상으로 입력해주세요.")
    .max(36, "비밀번호가 너무 깁니다.")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "비밀번호는 영문과 숫자를 반드시 포함해야합니다.")
    .regex(/^[A-Za-z\d~!@#$%^&*()+_|=|\-]+$/, "비밀번호는 영문, 숫자, 그리고 허용 가능한 일부 특수문자(~!@#$%^&*()+_|=|-)만을 사용할 수 있습니다.")
  })

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    })

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
      axios.post("/login", values)
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
                <Input placeholder="ID" {...field} />
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
                <Input type="password" placeholder="PASSWORD" {...field} />
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