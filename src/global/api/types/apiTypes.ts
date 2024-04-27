import { popToast } from "@/global/provider/ToastProvider";


// apiCode에 따라 실행할 콜백을 지정할 수 있는 명세서 타입
export interface ApiCodeActionsSpecification<T> {
  [code: number]: (apiRes: ApiResponse<T>) => void;
  success?: (apiRes: DataNonNullablePlainDtoApiResponse<T>) => void;
  default?: (apiRes: ApiResponse<T>) => void;
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

  match: (specification: ApiCodeActionsSpecification<T>) => void;
}

export class ApiResponseImpl<T> implements ApiResponse<T> {
  title: string;
  code: number;
  message: string;
  detail: string;
  #data: T | null;

  constructor(plain: PlainDtoApiResponse<T>){
    this.title = plain.title;
    this.code = plain.code;
    this.message = plain.message;
    this.detail = plain.detail;
    this.#data = plain.data;
  }

  get data(): T{
    if(this.#data !== null){
      return this.#data;
    } else {
      throw new Error("data가 null입니다.")
    }
  }

  match(specification: ApiCodeActionsSpecification<T>){
    switch(this.code){
      
      case 2000:
        if(specification.success){
          console.debug("success(2000) code를 기본 동작으로 처리합니다.")
          specification.success(this);
        }
        break;
        
        default:
          if(this.code in specification){
            console.debug("code :" + this.code + "을(를) 정의된 callback으로 처리합니다.")
            specification[this.code](this);
            
            // do default override
          } else if(specification.default){
          console.debug("code :" + this.code + "을(를) 재정의된 기본동작으로 처리합니다.")
          specification.default(this);

        // do default
        } else {
          console.debug("code :" + this.code + "에 대한 처리가 정의되지 않아, 기본동작으로 처리합니다.")
          let variant : "destructive" | "default" = this.code > 5000 ? "destructive" : "default";
          popToast({
            variant: variant,
            description: this.detail,
          })
        }
        break;
    }
  }

}

