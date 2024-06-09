
export interface FieldError {
  field: string;
  value: string | null;
  message: string;
}

export interface FieldErrors {
  errors: FieldError[];
}