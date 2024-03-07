'use client';
import { Button } from "@/components/ui/button";








export default function OAuth2LoginWidget(){
  return (
    <div className="flex justify-center space-x-2">
      {/* <Button onClick={loginWithOAuth}></Button> */}
      <Button>
        <a href="http://localhost:8888/oauth2/authorization/google">구글 로그인</a>
      </Button>
    </div>
  )
}