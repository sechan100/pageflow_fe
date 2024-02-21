// 클라이언트 세션에 저장될 사용자 정보
interface UserSession{
  id: number;
  email: string;
  username: string;
  penname: string;
}

interface ClientSession {
  isAuthenticated: boolean;
  user: UserSession | null;
}
