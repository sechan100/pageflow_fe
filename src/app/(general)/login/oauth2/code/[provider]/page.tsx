'use client';
import { sessionApi } from "@/bounded-context/user/api/sessionApi";
import { useSession } from "@/bounded-context/user/hooks/useSession";
import { useRouting } from "@/shared/hook/useRouting";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";


// oauth2 provider로부터 전달받은 code를 다시 api 서버로 전달하는 컴포넌트 페이지
export default function OAuth2CodeRequester(){
  const { forEach  } = useSearchParams();
  const { provider } = useParams();
  const path = usePathname();
  const { router } = useRouting();
  const { login } = useSession();
  
  const isAlreadyRequested = useRef(false);
  
  useEffect(() => {
    if(isAlreadyRequested.current) return;
    let url = path + '?';
    forEach((value, key) => {
      url += `${key}=${value}&`;
    });
    url = url.slice(0, -1);

    const apiRequestAsync = async () => {
      // 어차피 host만 클라이언트냐 서버냐에 따라 다르고, uri 자체는 같게 맞춰놨기 때문에, uri만 추출해서 다시 요청하면 된다.
      const res = await sessionApi.oauth2Login(url);
      res.dispatch(b => b
        .success(accessToken => login(accessToken))
        .when(2201, (res) => router.push("/signup/oauth2", {signupCache: res.data}))
      )
    }
    apiRequestAsync();
    isAlreadyRequested.current = true;
  }, [forEach, path, router, login]);

  return (
    <div>
      <p>{provider} 로그인 창입니다.</p>
    </div>
  )

}