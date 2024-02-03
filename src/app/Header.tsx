'use client';
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import UserWidget from "./UserWidget";
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import clsx from "clsx";






export default function Header(){


  const session = {
    authenticated: true
  }

  
  return (
    <header className="flex justify-between items-center container mt-5">
      <Title />
      <div className="flex items-center">
        <WriteLinkBtn authenticated={session.authenticated} />
        <UserWidget className="mx-2" session={session} />
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

function WriteLinkBtn({authenticated} : {authenticated: boolean}){
  return (
    <Link href="/book/write" className={clsx({"hidden": !authenticated})}>
      <Button variant="outline" className="rounded-full">
        <PencilLine className="mr-1" /> 집필하기
      </Button>
    </Link>
  )
}