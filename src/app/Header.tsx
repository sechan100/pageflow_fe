'use client';
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, PencilLine, Phone, UserCog } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"






export default function Header(){
  return (
    <header className="flex justify-between items-center">
      <Title />
      <div className="flex items-center">
        <WriteButton mr={2} />
        <User mr={2} />
        <ThemeSwitcher />
      </div>
    </header>
  )
}

function Title(){
  return (
    <h1 className="text-3xl font-bold">
      <a href="/">Pageflow</a>
    </h1>
  )
}

function WriteButton({mr} : {mr: number}) {
  return (
    <Link href="/book/write" className={"mr-" + mr}>
      <Button variant="outline" className="rounded-full">
        <PencilLine className="mr-1" /> 집필하기
      </Button>
    </Link>
  )
}


function User({mr} : {mr: number}){


  return (
    <div className={"mr-" + mr}>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" asChild>
            <div className="flex items-center justify-between">
              <Avatar className="mr-1">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/4233953?v=4"
                  alt="profile image"
                />
                <AvatarFallback>페플</AvatarFallback>
              </Avatar>
              <span>pageflow 작가님</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>100yearschan@gmail.com</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DDLink href="/account" name="계정 설정" icon={<UserCog />} />
          <DDLink href="/support" name="고객센터" icon={<Phone />} />
          <DDLink href="/logout" name="로그아웃" icon={<LogOut />} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function DDLink({href, name, icon} : {href: string, name: string, icon: React.ReactNode}){
  return (
    <Link href={href} className="flex items-center">
      <DropdownMenuItem className="w-full cursor-pointer">
        {icon}<span className="ml-2">{name}</span>
      </DropdownMenuItem>
    </Link>
  )
}