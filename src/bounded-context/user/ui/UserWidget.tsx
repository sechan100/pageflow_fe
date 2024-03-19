'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn/avatar";
import { Button } from "@/shared/components/shadcn/button";
import { LogOut, Phone, UserCog } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn/tooltip"
import clsx from "clsx";
import { Session, useSession } from "../model/useSession";





export default function UserWidget({className} : {className?: string}){

  const { session, isSessionLoading, logout } = useSession();


  if(isSessionLoading) return (
    <div className="px-3 text-red-100">
      사용자 정보를 불러오는 중입니다...
    </div>
  );
  const user = (session as Session).user;


  return (
    <div className={className}>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full cursor-pointer" asChild>
            <div className="flex items-center justify-between">
              <Avatar className="mr-2">
                <AvatarImage
                  src={user.profileImgUrl}
                  alt="profile image"
                />
                <AvatarFallback>
                  <AvatarImage
                    src="https://avatars.githubusercontent.com/u/4233953?v=4"
                    alt="profile image"
                  />
                </AvatarFallback>
              </Avatar>
              <span>{user.penname} 작가님</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <EmailLable email={user.email} isEmailVerified={user.isEmailVerified} />
          <DropdownMenuSeparator />
          <DDLink href="/account" name="계정 설정" icon={<UserCog />} />
          <DDLink href="/support" name="고객센터" icon={<Phone />} />
          <DDAction onClick={logout} name="로그아웃" icon={<LogOut />} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


function EmailLable({email, isEmailVerified} : {email: string, isEmailVerified: boolean}){
  return (
    <DropdownMenuLabel>
      <div className="flex items-center">
      </div>
      <TooltipProvider delayDuration={1000}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className={clsx({["text-red-400"]: !isEmailVerified})}>
            {email}
          </TooltipTrigger>
          <TooltipContent>
            { !isEmailVerified 
            ? <span className="text-red-500">이메일 인증이 필요합니다.</span>
            : <span className="text-green-500">인증됨</span>
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenuLabel>
  )
}


// Dropdown Menu의 item중, Link 컴포넌트 기반 + 아이콘인 경우
function DDLink({href, name, icon} : {href: string, name: string, icon: React.ReactNode}){
  return(
    <Link href={href} className="flex items-center">
      <DropdownMenuItem className="w-full cursor-pointer">
        {icon}<span className="ml-2">{name}</span>
      </DropdownMenuItem>
    </Link>
  )
}

function DDAction({onClick, name, icon} : {onClick: () => void, name: string, icon: React.ReactNode}){
  return(
    <DropdownMenuItem className="w-full cursor-pointer" onClick={onClick}>
        {icon}<span className="ml-2">{name}</span>
    </DropdownMenuItem>
  )
}