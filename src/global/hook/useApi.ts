import { create } from "zustand";
import { DefaultAxiosFactory } from "../api/DefaultAxiosFactory";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AsyncRequestBuilder } from "../api/AsyncRequestBuilder";
import { useState } from "react";
import { ApiCode, ApiCodeType } from "@/global/api/ApiCode";
import { useAuth } from "./useAuth";


const BEARER = "Bearer ";


const axiosStore = create<{ axios: AxiosInstance | null; }>((set) => ({
  axios: null,
}));


export const useApi = () => {
  const [apiCode, setApiCode] = useState<ApiCodeType>(ApiCode.clientOnly.LOADING);
  const { ensureToken } = useAuth();
  const { axios } = axiosStore();

  if(axios) {
    return {
      api: new AsyncRequestBuilder(axios, setApiCode),
      apiCode
    }
  }

  
  // 기본 요청 객체에 interceptor를 추가하기 위해, 새로운 요청체를 생성
  const newAxios = DefaultAxiosFactory.createDefaultAxiosInstance();
  newAxios.defaults.headers['Content-type'] = 'application/json; charset=UTF-8'; // 요청타입 헤더
  newAxios.defaults.headers['Accept'] = 'application/json'; // 응답타입 헤더
  
  // Axios async Interceptor 정의
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

  // 요청객체 인터셉터를 할당하고 store에 저장
  newAxios.interceptors.request.use(interceptorCallBack, interceptorErrorCallback);
  axiosStore.setState({ axios: newAxios });

  return {
    api: new AsyncRequestBuilder(newAxios, setApiCode),
    apiCode
  }
}