import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AccessTokenStorage } from "../session/AccessTokenStorage";



export class Request {

  #accessTokenStorage: AccessTokenStorage;
  #api: AxiosInstance;

  
  constructor(accessTokenStorage: AccessTokenStorage) {
    this.#accessTokenStorage = accessTokenStorage;
    this.#api = this.init(accessTokenStorage);
  }


  private init(storage: AccessTokenStorage){

    if(!process.env.NEXT_PUBLIC_CLIENT_HOST){
      throw new Error("NEXT_PUBLIC_CLIENT_HOST 환경변수가 설정되지 않았습니다.")
    }

    // axios 요청객체 정의
    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CLIENT_HOST + process.env.NEXT_PUBLIC_API_PREFIX,
    });
    
    // Axios Interceptor
    const interceptorCallBack = (config : InternalAxiosRequestConfig<any>) => {
      config.headers['Content-type'] = 'application/json; charset=UTF-8';
      config.headers['Accept'] = 'application/json';

      // 토큰이 존재한다면, Authorization 헤더를 추가함
      if(storage.isTokenExist()){
        config.headers["Authorization"] = storage.getToken();
        console.debug("[인증된 사용자]: 사용자의 AccessToken을 헤더에 포함했습니다.", storage.getToken())
      }
      
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


  api(): AxiosInstance {
    return this.#api;
  }


  anonymous(){
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST
    });
  }
}



