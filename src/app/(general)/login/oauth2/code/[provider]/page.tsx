'use client';
import { useSession } from "@/bounded-context/user/model/useSession";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";



export default function OAuth2CodeRequester(){
  const { forEach  } = useSearchParams();
  const { provider } = useParams();
  const path = usePathname();

  const { oauth2Login } = useSession();
  const isAlreadyRequested = useRef(false);

  useEffect(() => {
    if(isAlreadyRequested.current) return;
    let url = path + '?';
    forEach((value, key) => {
      url += `${key}=${value}&`;
    });
    url = url.slice(0, -1);
    
    oauth2Login(url);

    isAlreadyRequested.current = true;
  }, [forEach, oauth2Login, path]);

  return (
    <div>
      <p>{provider} 로그인 창입니다.</p>
    </div>
  )

}