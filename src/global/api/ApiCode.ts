


// ======[ common ]======
const common = {
  SUCCESS: "SUCCESS"
} as const;

// ======[ clientOnly ]======
const clientOnly = {
  LOADING: "LOADING"
} as const;

// ======[ user ]======
const user = {
  USER_NOT_FOUND: "USER_NOT_FOUND"
} as const;

export const ApiCode = {
  common,
  clientOnly,
  user,
} as const;


// 상수 객체의 값들로부터 유니온 타입 생성
export type ApiCodeType = 
    (typeof common)[keyof typeof common] 
  | (typeof clientOnly)[keyof typeof clientOnly]
  | (typeof user)[keyof typeof user]
  ;
