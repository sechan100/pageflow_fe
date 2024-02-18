import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AccessTokenStorage } from "../bounded-context/user/session/AccessTokenStorage";
import { RequestInstance } from "./RequestInstance";



export class ApiFactory {

  #accessTokenStorage: AccessTokenStorage;
  #api: AxiosInstance;

  
  constructor(accessTokenStorage: AccessTokenStorage) {
    this.#accessTokenStorage = accessTokenStorage;
    this.#api = this.init(accessTokenStorage);
  }

  // 기본적인 Axios 요청 객체를 생성하여 반환함
  private static newDefaultAxiosInstance(){
    if(!process.env.NEXT_PUBLIC_CLIENT_HOST){
      throw new Error("NEXT_PUBLIC_CLIENT_HOST 환경변수가 설정되지 않았습니다.")
    }
    if(!process.env.NEXT_PUBLIC_API_PREFIX){
      throw new Error("NEXT_PUBLIC_API_PREFIX 환경변수가 설정되지 않았습니다.")
    }

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_CLIENT_HOST + process.env.NEXT_PUBLIC_API_PREFIX
    });
  }

  private init(storage: AccessTokenStorage){
    // 기본 요청 객체에 interceptor를 추가하기 위해, 새로운 요청체를 생성
    const api = ApiFactory.newDefaultAxiosInstance();
    
    // Axios async Interceptor 정의
    const interceptorCallBack = async (config : InternalAxiosRequestConfig<any>) => {
      config.headers['Content-type'] = 'application/json; charset=UTF-8'; // 요청타입 헤더
      config.headers['Accept'] = 'application/json'; // 응답타입 헤더
      // 토큰 설정(await)
      config.headers["Authorization"] = await storage.ensureValidToken();

      return config;
    }

    // Axios Error Interceptor
    const interceptorErrorCallback = (err : AxiosError) => {
      return Promise.reject(err);
    }

    // 요청객체 인터셉터 설정
    api.interceptors.request.use(interceptorCallBack, interceptorErrorCallback);

    return api;
  }


  get(url: string){
    return new RequestInstance(this.#api, "GET", url);
  }

  post(url: string){
    return new RequestInstance(this.#api, "POST", url);
  }

  put(url: string){
    return new RequestInstance(this.#api, "PUT", url);
  }

  delete(url: string){
    return new RequestInstance(this.#api, "DELETE", url);
  }

  static anonymousGet(url: string){
    return new RequestInstance(ApiFactory.newDefaultAxiosInstance(), "GET", url);
  }

  static anonymousPost(url: string){
    return new RequestInstance(ApiFactory.newDefaultAxiosInstance(), "POST", url);
  }

  static anonymousPut(url: string){
    return new RequestInstance(ApiFactory.newDefaultAxiosInstance(), "PUT", url);
  }

  static anonymousDelete(url: string){
    return new RequestInstance(ApiFactory.newDefaultAxiosInstance(), "DELETE", url);
  }
}

