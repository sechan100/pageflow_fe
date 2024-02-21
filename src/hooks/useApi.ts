import { create } from "zustand";
import { DefaultAxiosFactory } from "../api/AnonymousApi";
import ensureValidAccessToken from "../api/ensureValidAccessToken";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AsyncApiBuilder } from "../api/RequestInstance";
import { useState } from "react";
import { CodeType } from "@/constants/response-code/ResponseCode";


const BEARER = "Bearer";


const axiosStore = create<{ axios: AxiosInstance | null; }>((set) => ({
  axios: null
}));


interface UseApiReturn {
  api: AsyncApiBuilder;
  code: string; // useState
}

const useApi: (url: string) => UseApiReturn = (url: string) => {
  const [code, setCode] = useState<string>(CodeType.clientOnly.LOADING);
  const { axios } = axiosStore();

  if(axios) {
    return {
      api: new AsyncApiBuilder(axios, setCode),
      code
    }
  }

  
  // 기본 요청 객체에 interceptor를 추가하기 위해, 새로운 요청체를 생성
  const newAxios = DefaultAxiosFactory.createDefaultAxiosInstance();
  newAxios.defaults.headers['Content-type'] = 'application/json; charset=UTF-8'; // 요청타입 헤더
  newAxios.defaults.headers['Accept'] = 'application/json'; // 응답타입 헤더
  
  // Axios async Interceptor 정의
  const interceptorCallBack = async (config : InternalAxiosRequestConfig<any>) => {
    // 토큰 설정(await)
    config.headers["Authorization"] = BEARER + await ensureValidAccessToken();
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
    api: new AsyncApiBuilder(newAxios, setCode),
    code
  }
}