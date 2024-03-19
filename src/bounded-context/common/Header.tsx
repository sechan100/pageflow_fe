'use client';
import { ThemeSwitcher } from "@/bounded-context/common/ThemeSwitcher";
import UserWidget from "../user/ui/UserWidget";
import Entrypoint from "../user/ui/Entrypoint";
import { useSession } from "@/bounded-context/user/model/useSession";
import { BookWriteBtn } from "../book/ui/BookWriteBtn";
import { Title } from "./TItle";






export default function Header(){

  const { isAuthenticated } = useSession();
  
  return (
    <header className="flex justify-between items-center container mt-5">
      <Title />
      <div className="flex items-center">
        {isAuthenticated ?
        // 로그인
        <>
          <BookWriteBtn />
          <UserWidget className="mx-2" />
        </> :
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
