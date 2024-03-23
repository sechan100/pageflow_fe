'use client';
import { ThemeSwitcher } from "@/bounded-context/common/ThemeSwitcher";
import { Title } from "./Title";
import dynamic from "next/dynamic";
import { Separator } from "@/shared/components/shadcn/separator";


const ClientHeader = dynamic(() => import("../common/ClientHeader"), {ssr: false});




export default function Header(){
  return (
    <>
      <header className="flex justify-between items-center container pt-3">
        <Title />
        <div className="flex items-center">
          <ClientHeader />
          <ThemeSwitcher />
        </div>
      </header>
      <Separator className="my-3" />
    </>
  )
}
