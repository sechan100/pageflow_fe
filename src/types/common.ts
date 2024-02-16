interface GlobalResponse<T> {
  code: string;
  data: T;
  message: string;
}