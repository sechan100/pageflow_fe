import axios from "axios";


export class DefaultAxiosFactory {


  // 기본적인 Axios 요청 객체를 생성하여 반환함
  static createDefaultAxiosInstance(){
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
}

