'use client';
import { useApi } from "@/global/hook/useApi";
import { useSession } from "@/global/hook/useSession";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";



export default function OAuth2CodeRequester(){
  const { api } = useApi();
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