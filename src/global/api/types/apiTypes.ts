import { popToast } from "@/global/provider/ToastProvider";
import { Qahiri } from "next/font/google";
import { Dispatch, SetStateAction, useState } from "react";


interface ApiCodeActionsSpecification<T> {
  [key: number]: (res: ApiResponse<T>) => void;
  default?: (res: ApiResponse<T>) => void;
}

interface DataNonNullablePlainDtoApiResponse<T> {
  title: string;
  code: number;
  message: string;
  detail: string;
  data: T;
}

export interface PlainDtoApiResponse<T> {
  title: string;
  code: number;
  message: string;
  detail: string;
  data: T | null;
}

export interface ApiResponse<T> {
  title: string; // 응답 제목
  code: number; // unique한 응답 코드(code > 0)
  message: string; // 개발자를 위한 응답 메시지
  detail: string; // 사용자에게 바로 보여줘도 무방한 에러 설명
  data: T; // 데이터 객체(null이라면 에러를 던진다. 반드시 존재한다는 것이 확실한 경우에만 getter로 접근)

  // dispatch trigger
  dispatch: (builder: (spec: ApiHanlder<T>) => void) => void;
}

export interface ApiHanlder<T> {
  // 성공 action
  success: (action: (data: T) => void) => ApiHanlder<T>;
  // code별 action 지정
  $: (code: number, action: (res: ApiResponse<T>) => void) => ApiHanlder<T>;
  // 성공이 아닌 모든 code에 대한 action 지정
  default: (action: (res: ApiResponse<T>) => void) => ApiHanlder<T>;
  // toast로 나머지 code를 처리
  defaultWithToast: () => ApiHanlder<T>;
  // code값을 react state에 할당
  allocate: (setCode: Dispatch<SetStateAction<number>>) => ApiHanlder<T>;
}


export class ApiResponseImpl<T> implements ApiResponse<T>, ApiHanlder<T> {
  title: string;
  code: number;
  message: string;
  detail: string;
  #data: T | null;
  #actions: ApiCodeActionsSpecification<T>;
  #setCode: Dispatch<SetStateAction<number>> | null;

  constructor(plain: PlainDtoApiResponse<T>){
    this.title = plain.title;
    this.code = plain.code;
    this.message = plain.message;
    this.detail = plain.detail;
    this.#data = plain.data;
    this.#actions = {};
    this.#setCode = null;
  }

  get data(): T{
    if(this.#data !== null){
      return this.#data;
    } else {
      throw new Error("data가 null입니다.")
    }
  }

  success(action: (data: T) => void){
    this.#actions[2000] = () => action(this.data);
    return this;
  }
  
  $(code: number, action: (res: ApiResponse<T>) => void){
    this.#actions[code] = action;
    return this;
  }
  
  default(action: (res: ApiResponse<T>) => void){
    this.#actions.default = action;
    return this;
  }
  
  defaultWithToast(){
    this.default(() =>
      popToast({
        variant: "destructive",
        description: this.detail,
      })
    );
    return this;
  }
  
  allocate(setCode: Dispatch<SetStateAction<number>>){
    this.#setCode = setCode;
    return this;
  }
  
  dispatch(builder: (spec: ApiHanlder<T>) => void){
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
    if(this.#setCode){
      this.#setCode(this.code);
    }
  }
}

