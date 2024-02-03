'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Phone, UserCog } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"





export default function UserWidget({className, session} : {className?: string, session: {authenticated: boolean}}){

  return (
    <div className={className}>
      {session.authenticated && <LoginedUser /> || <AnonymousUser />} 
    </div>
  )
}








function AnonymousUser(){
  return (
    <Link href="/login">
      <Button variant="outline" className="rounded-full">
        로그인
      </Button>
    </Link>
  )
}

function LoginedUser(){
  return (
    <>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full cursor-pointer" asChild>
            <div className="flex items-center justify-between">
              <Avatar className="mr-1">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/4233953?v=4"
                  alt="profile image"
                />
                <AvatarFallback>
                  <AvatarImage
                    src="https://avatars.githubusercontent.com/u/4233953?v=4"
                    alt="profile image"
                  />
                </AvatarFallback>
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
    </>
  )
}

// Dropdown Menu의 item중, Link 컴포넌트 기반 + 아이콘인 경우
function DDLink({href, name, icon} : {href: string, name: string, icon: React.ReactNode}){
  return (
    <Link href={href} className="flex items-center">
      <DropdownMenuItem className="w-full cursor-pointer">
        {icon}<span className="ml-2">{name}</span>
      </DropdownMenuItem>
    </Link>
  )
}

function _getUserSession(UID: number){
  return {
    isLogin: false,
    user: {
      id: 1,
      username: "pageflow",
      email: "email12944@pageflow.org",
      profileImgUrl: "https://avatars.githubusercontent.com/u/4233953?v=4",
      penname: "페플러"
    }
  }
}