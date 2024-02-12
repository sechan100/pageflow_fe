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





export default function UserWidget({className} : {className?: string}){
  return (
    <div className={className}>
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
    </div>
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