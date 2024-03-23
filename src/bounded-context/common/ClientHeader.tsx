import BookWriteBtn from "../book/ui/BookWriteBtn";
import { useSession } from "../user/model/useSession";
import Entrypoint from "../user/ui/Entrypoint";
import UserWidget from "../user/ui/UserWidget";




export default function ClientHeader(){
  
  const { isAuthenticated } = useSession();

  return (
    <>
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
    </>
  )
}