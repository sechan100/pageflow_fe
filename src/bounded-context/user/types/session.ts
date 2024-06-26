

export interface Session {
  user: SessionUser;
}

export interface SessionUser {
  uid: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  role: "ROLE_USER" | "ROLE_MANAGER" |"ROLE_ADMIN";
  penname: string;
  profileImageUrl: string;
}