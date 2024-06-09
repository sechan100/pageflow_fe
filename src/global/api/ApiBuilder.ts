import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse, ApiResponseImpl, PlainDtoApiResponse } from "./ApiResponse";
import { accessTokenManager } from "@/bounded-context/user/model/accessTokenManager";



// 1
export interface IApiSetAuth {
  authenticated(): IApiSetMethodAndUri;
  anonymous(): IApiSetMethodAndUri;
}

// 2
export interface IApiSetMethodAndUri {
  get(uri: string): Api;
  post(uri: string): Api;
  put(uri: string): Api;
  delete(uri: string): Api;
}

// 3
export interface Api {
  data(data: any): Api;
  params(params: any): Api;
  param(key: string, value: string): Api;
  contentType(type: string): Api;
  fetch(): Promise<ApiResponse>;
}




const BEARER = "Bearer ";

class ApiBuilder implements Api, IApiSetMethodAndUri, IApiSetAuth {

  #config: AxiosRequestConfig; // axios 요청 설정 객체
  #auth: boolean; // 인증된 요청을 보낼 것인지(Authorization 헤더를 포함하는가)


  constructor(){
    this.#config = {
      baseURL: getProxyUrl(),
      headers: {
        "Content-type": "application/json; charset=UTF-8", // 요청타입
        "Accept": "application/json", // 응답타입
      }
    };
    this.#auth = false;
  }
  
  
  // ============= auth methods ==================
  authenticated(){
    this.#auth = true;
    return this;
  }

  anonymous(){
    this.#auth = false;
    return this;
  }

// ============= config methods ==================
  data(data: any){ // Request Body
    this.#config.data = data;
    return this;
  }

  // queryString
  params(params: any){
    this.#config.params = params;
    return this;
  }

  // queryString
  param(key: string, value: string){
    this.#config.params = {
      ...this.#config.params,
      [key]: value
    }
    return this;
  }

  contentType(type: string){
    this.#config.headers!["Content-Type"] = type;
    return this;
  }


  // =========== http 메소드, uri지정 methods =================
  get(uri: string){
    this.#config.method = "GET";
    this.#config.url = uri;
    return this;
  }
  post(uri: string){
    this.#config.method = "POST";
    this.#config.url = uri;
    return this;
  }
  put(uri: string){
    this.#config.method = "PUT";
    this.#config.url = uri;
    return this;
  }
  delete(uri: string){
    this.#config.method = "DELETE";
    this.#config.url = uri;
    return this;
  }

  // 요청 전송
  async fetch<T>(): Promise<ApiResponse> {
    // 전처리
    if(!this.#auth){
      delete this.#config.headers?.Authorization;
    } else {
      this.#config.headers!.Authorization = BEARER + await accessTokenManager.getValidAccessToken();
    }

    // 요청 + 응답 시간 측정
    const startTime = performance.now();
    const axiosRes = await axios.request<PlainDtoApiResponse>(this.#config);
    const res: ApiResponse = new ApiResponseImpl(axiosRes.data);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    // 요청 + 응답 시간 측정 끝

    // 로깅
    console.debug(`
============[ Api Request ]============
[URL]: ${this.#config.url}
[METHOD]: ${this.#config.method}
[DATA]: ${JSON.stringify(this.#config.data)}
[DELAY]: ${timeTaken}ms
[RES]: 
${JSON.stringify(axiosRes.data, null, 2)}
    `);

    return Promise.resolve(res);
  }

}


// "/https?://${domain}.${TLD}/${PROXY_PREFIX}" 형식의 기본 url을 반환한다.
const getProxyUrl : () => string = () => {
  if(!process.env.NEXT_PUBLIC_CLIENT_HOST){
    throw new Error("NEXT_PUBLIC_CLIENT_HOST 환경변수가 설정되지 않았습니다.")
  }
  if(!process.env.NEXT_PUBLIC_PROXY_PREFIX){
    throw new Error("NEXT_PUBLIC_PROXY_PREFIX 환경변수가 설정되지 않았습니다.")
  }
  return process.env.NEXT_PUBLIC_CLIENT_HOST + process.env.NEXT_PUBLIC_PROXY_PREFIX
}

export const api: () => IApiSetAuth = () => {
  return new ApiBuilder();
}