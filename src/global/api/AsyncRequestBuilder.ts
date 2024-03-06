import { ApiCode, ApiCodeType } from "@/global/api/ApiCode";
import { triggerToast } from "@/global/provider/ToastProvider";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { time, timeEnd } from "console";
import { Dispatch, SetStateAction } from "react";
import { debug } from "util";


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

export interface GlobalResponse<T> {
  apiCode: ApiCodeType;
  data: T;
  message: string;
}


export class AsyncRequestBuilder {

  #axios: AxiosInstance;
  #config: AxiosRequestConfig;
  #actions: CodeActions;
  #auth: boolean;

  constructor(axios: AxiosInstance){
    this.#axios = axios;
    this.#config = {};
    this.#actions = {};
    this.#auth = true; // 기본값은 Authorization 헤더를 포함하는 요청임.
  }


  // =========== GET, POST, PUT, DELETE =================
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
// =======================================================

// 설정 메소드들

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

  // AccessToken 포함 여부
  anonymous(){
    this.#auth = false;
    return this;
  }

  /*
   * 서버의 응답 코드에 따라서 SUCCESS 코드인 경우 응답된 데이터를 반환하고, 
   * 그 외의 코드의 경우는 actions 객체에서 정의된 핸들러를 호출한다.
   * 만약 actions에 해당 코드에 대한 핸들러가 정의되지 않은 경우, 에러를 발생시킨다.
   */
  async fetch<T>(): Promise<T> {

    // axios 인터셉터의 로직을 on/off하는 플래그 헤더
    this.#config.headers = {
      ...this.#config.headers,
      "Pageflow-Auth": this.#auth
    };
    const requestInfo = 
    `============[ Server Request ]============
    URL: ${this.#config.url}
    METHOD: ${this.#config.method}
    DATA: ${JSON.stringify(this.#config.data)}
    AUTHORIZATION: ${this.#auth}`;

    try {
      const startTime = performance.now();
      // 요청 시작
      const axiosRes = await this.#axios.request<T>(this.#config);
      const res = axiosRes.data as GlobalResponse<T>;
      // 요청 끝
      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      console.debug(requestInfo + `\n[ApiCode]: ${res.apiCode}(${res.message})\n[delay]: ${timeTaken}ms`)

      // 정의된 Actions가 존재한다면 콜백을 호출
      if(this.#actions && res.apiCode in this.#actions && typeof this.#actions[res.apiCode] === "function"){
        try {
          console.debug(`[AsyncRequestBuilder]: apiCode [${res.apiCode}]로 정의된 Action을 호출합니다.`);
          this.#actions[res.apiCode](res.data);
        // action 내부에서 에러가 발생한 경우
        } catch(e: any) {
          throw new Error(`[CodeAction Error]: [${res.apiCode}]으로 정의된 CodeAction 호출중 에러가 발생했습니다. \n Callback Actions 에러: ${e.message}`);
        }
      /**
       * apiCode가 'SUCCESS'가 아님에도
       * 정의된 actions가 없거나, actions에서 해당 코드에 대한 핸들러를 찾을 수 없는 경우
       */
      } else {
        if(res.apiCode !== ApiCode.common.SUCCESS){
          throw new Error(`[CodeAction never defined]: [${res.apiCode}]("${res.message}") 코드에 대한 CodeAction이 정의되지 않았습니다. `);
        }
      }
      
      // ApiCode가 성공하지 못했다면 Promise를 reject
      if(res.apiCode !== ApiCode.common.SUCCESS){
        return Promise.reject(new RejectedForCodeActionCall(res.apiCode, res.message));
      // 성공했다면, 데이터를 반환
      } else {
        return res.data;
      }
    } catch(e: any){
      
      if(!(e instanceof RejectedForCodeActionCall)){
        console.error(requestInfo + `\n[Error]: ${e.message}`)
      }

      triggerToast({
        variant: "destructive",
        title: "요청 실패",
        description: "서버 요청 중 문제가 발생했습니다. 잠시후 다시 시도해주세요.",
      })
      return Promise.reject(e);
    }
  }


}
