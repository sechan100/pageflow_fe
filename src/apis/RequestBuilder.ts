import { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";



// 응답 코드에 따라서 실행할 핸들러들의 참조들을 정의
export interface CodeActions {
  [code: string]: CallableFunction;
}



export class RequestBuilder {

  #axios: AxiosInstance;
  #config: AxiosRequestConfig;
  #actions: CodeActions;

  constructor(axios: AxiosInstance, method: Method, url: string){
    this.#axios = axios;
    this.#config = {
      method,
      url
    };
    this.#actions = {};
  }


  // Response Code별 처리 핸들러 정의서
  actions(actions: CodeActions){
    this.#actions = actions;
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


  /*
   * 서버의 응답 코드에 따라서 SUCCESS 코드인 경우 응답된 데이터를 반환하고, 
   * 그 외의 코드의 경우는 actions 객체에서 정의된 핸들러를 호출한다.
   * 만약 actions에 해당 코드에 대한 핸들러가 정의되지 않은 경우, 에러를 발생시킨다.
   */
  private async delegateRequest<T = any>(): Promise<T> {
    const axiosRes = await this.#axios.request<T>(this.#config);
    const res = axiosRes.data as GlobalResponse<T>;
    
    // 성공하지 못했다면 Actions에서 코드에 따른 핸들러를 호출
    if(res.code !== "SUCCESS"){
      if(this.#actions && res.code in this.#actions){
        this.#actions[res.code](res.data);
        return Promise.reject(res.data);

      // 정의된 actions가 없거나, actions에서 해당 코드에대한 핸들러를 찾을 수 없는 경우
      } else {
        throw new Error(`[API ERROR]: "${res.code}(${res.message})" 서버 API코드에 대한 처리 핸들러가 정의되지 않았습니다.`);
      }

    // 성공했다면, 데이터를 반환
    } else {
      return res.data;
    }
  }

    // 기대되는 응답 값이 없는 경우에 사용하는 api 트리거
    execute(): void {
      this.delegateRequest();
    }
  
    // 응답 값이 있는 경우에 사용하는 api 트리거(응답 객체 타입을 제네릭으로 필수 지정해주어야함.)
    async fetch<T>(): Promise<T> {
      return await this.delegateRequest<T>();
    }
}
