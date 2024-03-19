import { DefaultAxiosFactory } from "./DefaultAxiosFactory";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AsyncRequestBuilder } from "./AsyncRequestBuilder";
import { accessTokenManager } from "../../bounded-context/user/class/accessTokenManager";


const BEARER = "Bearer ";

// 기본 요청 객체에 interceptor를 추가하기 위해, 새로운 요청체를 생성
const instance: AxiosInstance = DefaultAxiosFactory.createDefaultAxiosInstance();

const { ensureToken } = accessTokenManager;


// async Interceptor
const interceptorCallBack = async (config : InternalAxiosRequestConfig<any>) => {
  // Pageflow-Auth 헤더가 true인 경우에만 AccessToken을 추가한 요청을 전송한다.
  if(config.headers["Pageflow-Auth"]){
    config.headers["Authorization"] = BEARER + await ensureToken();
  }
  return config;
}

// Axios Error Interceptor
const interceptorErrorCallback = (err : AxiosError) => {
  return Promise.reject(err);
}


// 인터셉터 할당
instance.interceptors.request.use(interceptorCallBack, interceptorErrorCallback);
export const api = new AsyncRequestBuilder(instance);