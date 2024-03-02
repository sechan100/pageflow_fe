'use client';
import { Button } from "@/components/ui/button";
import { useApi } from "@/global/hook/useApi";
import { useParams, usePathname, useSearchParams } from "next/navigation";








export default function OAuth2LoginWidget(){







  return (
    <div className="flex justify-center space-x-2">
      {/* <Button onClick={loginWithOAuth}></Button> */}
      <Button>
        <a href="http://localhost:8888/oauth2/authorization/google">이동하기</a>
      </Button>
    </div>
  )
}