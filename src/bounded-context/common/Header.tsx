import BookWriteBtn from "../book/ui/BookWriteBtn";
import { useSession } from "../user/hooks/useSession";
import Entrypoint from "../user/ui/Entrypoint";
import UserInfoWidget from "../user/ui/UserWidget";




export default function Header(){
  
  const { isAuthenticated } = useSession();

  return (
    <>
      {isAuthenticated ?
        // 로그인
        <>
          <BookWriteBtn />
          <UserInfoWidget className="mx-2" />
        </> :
        // 비회원
        <>
          <Entrypoint className="mx-2" />
        </>
        }
    </>
  )
}