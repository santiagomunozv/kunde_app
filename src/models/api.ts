export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | null;
  code: string | null;
  meta: unknown;
};

export class ApiError extends Error {
  status: number;
  code: string | null;
  errors: ApiResponse<unknown>["errors"];

  constructor(message: string, status: number, code: string | null = null, errors: ApiResponse<unknown>["errors"] = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
