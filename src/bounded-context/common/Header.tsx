'use client';
import { ThemeSwitcher } from "@/bounded-context/common/ThemeSwitcher";
import { Title } from "./Title";
import dynamic from "next/dynamic";


const ClientHeader = dynamic(() => import("../common/ClientHeader"), {ssr: false});




export default function Header(){
  return (
    <header className="flex justify-between items-center container mt-5">
      <Title />
      <div className="flex items-center">
        <ClientHeader />
        <ThemeSwitcher />
      </div>
    </header>
  )
}
