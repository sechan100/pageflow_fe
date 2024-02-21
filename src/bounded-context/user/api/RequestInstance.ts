import { CodeType } from "@/global/response-code/ResponseCode";
import { triggerToast } from "@/global/toast/ToastProvider";
import { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import { Dispatch, SetStateAction } from "react";



// 응답 코드에 따라서 실행할 핸들러들의 참조들을 정의
export interface CodeActions {
  [code: string]: (data: any) => void;
}

// 요청 Promise의 실패의 원인이 CodeAction의 올바른 호출에 의한 것인 경우 해당 에러를 통해 reject한다.
export class RejectedForCodeActionCall {
  message: string;
  name: string;
  constructor(code: string, message: string) {
    this.message = message;
    this.name = code;
  }
}



export class AsyncApiBuilder {

  #axios: AxiosInstance;
  #config: AxiosRequestConfig;
  #actions: CodeActions;
  #setCodeOrNull: Dispatch<SetStateAction<string>> | null;

  constructor(axios: AxiosInstance, setCodeOrNull: Dispatch<SetStateAction<string>> | null){
    this.#axios = axios;
    this.#config = {};
    this.#actions = {};
    this.#setCodeOrNull = setCodeOrNull;
  }


  get(url: string){
    this.#config.method = "GET";
    this.#config.url = url;
    return this;
  }
  post(url: string){
    this.#config.method = "POST";
    this.#config.url = url;
    return this;
  }
  put(url: string){
    this.#config.method = "PUT";
    this.#config.url = url;
    return this;
  }
  delete(url: string){
    this.#config.method = "DELETE";
    this.#config.url = url;
    return this;
  }


  // Response Code별 처리 핸들러 정의서
  actions(actions: CodeActions){
    this.#actions = actions;
    return this;
  }

  action(code: string, action: (data: any) => void){
    this.#actions[code] = action;
    return this;
  }

  // Request Body
  data(data: any){
    this.#config.data = data;
    return this;
  }

  // queryString에 추가될 parameters
  params(params: any){
    this.#config.params = params;
    return this;
  }

  // 요청타입 헤더
  contentType(type: string){
    this.#config.headers = {
      ...this.#config.headers,
      "Content-type": type
    };
    return this;
  }


  /*
   * 서버의 응답 코드에 따라서 SUCCESS 코드인 경우 응답된 데이터를 반환하고, 
   * 그 외의 코드의 경우는 actions 객체에서 정의된 핸들러를 호출한다.
   * 만약 actions에 해당 코드에 대한 핸들러가 정의되지 않은 경우, 에러를 발생시킨다.
   */
  async fetch<T>(): Promise<T> {
    try {
      const axiosRes = await this.#axios.request<T>(this.#config);
      const res = axiosRes.data as GlobalResponse<T>;

      // useApi 훅으로 반환한 code값의 상태를 업데이트.(default value: LOADING)
      if(this.#setCodeOrNull){
        this.#setCodeOrNull(res.code);
      }
      
      // 성공하지 못했다면 Actions에서 코드에 따른 핸들러를 호출
      if(res.code !== CodeType.common.SUCCESS){
        if(this.#actions && res.code in this.#actions && typeof this.#actions[res.code] === "function"){
          try {
            console.debug(`[응답 코드에 의한 분기]: 코드 [${res.code}]가 발생하여, 정의된 Action을 호출합니다.`);
            this.#actions[res.code](res.data);
            return Promise.reject(new RejectedForCodeActionCall(res.code, res.message));
  
          // action 내부에서 에러가 발생한 경우
          } catch(e: any) {
            throw new Error(`[CodeAction Error]: [${res.code}]으로 정의된 CodeAction 호출중 에러가 발생했습니다. \n Callback Actions 에러: ${e.message}`);
          }
          
        // 정의된 actions가 없거나, actions에서 해당 코드에 대한 핸들러를 찾을 수 없는 경우
        } else {
          throw new Error(`[CodeAction never defined]: [${res.code}]("${res.message}") 코드에 대한 CodeAction이 정의되지 않았습니다. `);
        }
      // 성공했다면, 데이터를 반환
      } else {
        return res.data;
      }
    } catch(e: any){
      triggerToast({
        variant: "destructive",
        title: "요청 실패",
        description: "서버 요청 중 문제가 발생했습니다. 잠시후 다시 시도해주세요.",
      })
      return Promise.reject(e);
    }
  }


}
