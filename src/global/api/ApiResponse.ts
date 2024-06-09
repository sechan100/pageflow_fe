import { popToast } from "@/global/provider/ToastProvider";
import { Dispatch, SetStateAction } from "react";


// 특정 api code과 그에 따른 callback을 매핑해두는 객체
interface ApiCodeActionsSpecification {
  [key: number]: (res: ApiResponse) => void;
  default?: (res: ApiResponse) => void;
}

export interface PlainDtoApiResponse {
  code: number;
  data: any | null;
  message: string;
  title: string;
}

// 실제 서버로부터 받는 api 응답 객체
export interface ApiResponse {
  title: string; // 응답 제목
  code: number; // unique한 응답 코드(code > 0)
  message: string; // 개발자를 위한 응답 메시지
  data: any; // 데이터 객체(null이라면 에러를 던진다. 반드시 존재한다는 것이 확실한 경우에만 getter로 접근)

  // dispatch trigger
  dispatch: (builder: (spec: ApiHanlder) => void) => void;
}

// api 응답 객체를 처리하기위한 핸들러 인터페이스
export interface ApiHanlder {
  // 성공 action
  success: (action: (data: any) => void) => ApiHanlder;
  // code별 action 지정
  when: (code: number, action: (res: ApiResponse) => void) => ApiHanlder;
  // 기본 toast를 띄움
  pop(code: number, message: string, title?: string): ApiHanlder;
  // destructive toast를 띄움
  error(code: number, message: string, title?: string): ApiHanlder;
  // 성공이 아닌 모든 code에 대한 action 지정
  default: (action: (res: ApiResponse) => void) => ApiHanlder;
}


export class ApiResponseImpl implements ApiResponse, ApiHanlder {
  title: string;
  code: number;
  message: string;
  #data: any | null;
  #actions: ApiCodeActionsSpecification;

  constructor(plain: PlainDtoApiResponse){
    this.title = plain.title;
    this.code = plain.code;
    this.message = plain.message;
    this.#data = plain.data;
    this.#actions = {};
    // defaultAction의 기본 값은 popToast
    this.default(() =>
    popToast({
      variant: "destructive",
      description: "서버 요청 처리중 오류가 발생했습니다.",
    })
  );
  }

  get data(): any{
    if(this.#data !== null){
      return this.#data;
    } else {
      throw new Error("data가 null입니다.")
    }
  }

  success(action: (data: any) => void){
    this.#actions[2000] = () => action(this.data);
    return this;
  }
  
  when(code: number, action: (res: ApiResponse) => void){
    this.#actions[code] = action;
    return this;
  }

  pop(code: number, message: string, title?: string){
    this.when(code, (res) => popToast({
      variant: "default",
      title: title ? title : undefined,
      description: message,
    }))
    return this;
  }

  error(code: number, message: string, title?: string){
    this.when(code, (res) => popToast({
      variant: "destructive",
      title: title ? title : undefined,
      description: message,
    }))
    return this;
  }
  
  default(action: (res: ApiResponse) => void){
    this.#actions.default = action;
    return this;
  }

  dispatch(builder: (spec: ApiHanlder) => void){
    builder(this);
    switch(this.code){
      case 2000:
        if(this.#actions[2000]){
          console.debug("process: code 2000(SUCCESS)를 정의된 action으로 처리했습니다")
          this.#actions[2000](this);
        }
        break;
        
      default:
        if(this.code in this.#actions){
          console.debug(`process: code ${this.code}(${this.title})를(을) 정의된 action으로 처리했습니다`)
          this.#actions[this.code](this);
          
        // do default override
        } else if(this.#actions.default){
          console.debug(`process: code ${this.code}(${this.title})를(을) default code action으로 처리했습니다`)
          this.#actions.default(this);
        } else {
          console.debug(`process: code ${this.code}(${this.title})를(을) 처리하지 않았습니다.`)
        }
        break;
    }
  }
}

