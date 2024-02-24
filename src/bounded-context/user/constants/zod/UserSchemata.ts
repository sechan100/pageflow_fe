import { z } from "zod"

// Username
const username = z.string()
  .min(1, "아이디를 입력해주세요.")
  .min(4, "아이디를 4자 이상으로 입력해주세요.")
  .max(100, "아이디가 너무 깁니다.")
  .regex(/^[-a-zA-Z0-9]+$/, "아이디는 영문과 숫자만을 사용할 수 있습니다.")

// Password
const password = z.string()
  .min(1, "비밀번호를 입력해주세요.")
  .min(8, "비밀번호를 8자 이상으로 입력해주세요.")
  .max(36, "비밀번호가 너무 깁니다.")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "비밀번호는 영문과 숫자를 반드시 포함해야합니다.")
  .regex(/^[A-Za-z\d~!@#$%^&*()+_|=|\-]+$/, "비밀번호는 영문, 숫자, 그리고 허용 가능한 일부 특수문자(~!@#$%^&*()+_|=|-)만을 사용할 수 있습니다.")

// Penname
const penname = z.string()
  .min(1, "펜네임을 입력해주세요.")
  .min(2, "펜네임을 2자 이상으로 입력해주세요.")
  .max(12, "펜네임이 너무 깁니다.")
  .regex(/^[가-힣a-zA-Z0-9]+$/, "펜네임은 한글, 영문, 숫자만을 사용할 수 있습니다.")

export const zodUserSchemata = {
  username, 
  password, 
  penname
};