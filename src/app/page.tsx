'use client';
import { ThemeSwitcher } from "@/libs/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useContext } from "react";
import { SessionContext } from "./GlobalProviders";

export default function Home() {

  const {sessionManager, api} = useContext(SessionContext);


  return (
    <>
      <h1>메인 페이지</h1>
      <Button onClick={() => {api.get("/user/me").execute()}}>Authorization 헤더를 포함한 요청을 전송하기!</Button>
    </>
  );
}