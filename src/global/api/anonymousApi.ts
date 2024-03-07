import { AsyncRequestBuilder } from "./AsyncRequestBuilder";
import { DefaultAxiosFactory } from "./DefaultAxiosFactory";


// 익명 요청 객체
export const anonymousApi = new AsyncRequestBuilder(DefaultAxiosFactory.createDefaultAxiosInstance());