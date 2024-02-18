'use client';
import { ThemeSwitcher } from "@/libs/theme/ThemeSwitcher";
import UserWidget from "../user/widget/UserWidget";
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Entrypoint from "../user/entrypoint/Entrypoint";






export default function Header(){


  const session = {
    authenticated: false
  }

  
  return (
    <header className="flex justify-between items-center container mt-5">
      <Title />
      <div className="flex items-center">
        {session.authenticated && 
        // 로그인
        <>
          <WriteLinkBtn />
          <UserWidget className="mx-2" />
        </> ||
        // 비회원
        <>
          <Entrypoint className="mx-2" />
        </>
        }
        <ThemeSwitcher />
      </div>
    </header>
  )
}

function Title(){
  return (
    <h1 className="text-3xl py-3">
      <a href="/">Pageflow</a>
    </h1>
  )
}

function WriteLinkBtn(){
  return (
    <Link href="/book/write">
      <Button variant="outline" className="rounded-full">
        <PencilLine className="mr-1" /> 집필하기
      </Button>
    </Link>
  )
}
