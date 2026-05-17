import { config } from "@constants/config";
import storageKeys from "@constants/storageKeys";
import StorageService from "@api/StorageService";
import { ApiError, ApiResponse } from "@models/api";

type RequestParams = {
  url: string;
  data?: unknown;
  bearer?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  timeoutMs?: number;
};

function buildUrl(path: string) {
  return `${config.apiBaseUrl}${path}`;
}

async function request<T>({ url, data, bearer = true, method = "GET", timeoutMs = 20000 }: RequestParams): Promise<T> {
const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (bearer) {
    const token = await StorageService.getValue(storageKeys.AUTH_TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const requestUrl = buildUrl(url);
  let response: Response;
  let didTimeout = false;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    response = await fetch(requestUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (didTimeout || (err instanceof Error && err.name === "AbortError")) {
      throw new ApiError(
        `La consulta tardó más de ${Math.round(timeoutMs / 1000)} segundos. Intenta nuevamente.`,
        0,
        "REQUEST_TIMEOUT",
      );
    }

    throw new ApiError(
      `No se pudo conectar con el servidor (${requestUrl}). Verifica la URL base y la red.`,
      0,
      "NETWORK_ERROR",
    );
  } finally {
    clearTimeout(timeout);
  }

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !json?.success) {
    throw new ApiError(
      json?.message || "Ha ocurrido un error",
      response.status,
      json?.code || null,
      json?.errors || null,
    );
  }

  return json.data;
}

const ApiServiceFetch = {
  get<T>({ url, bearer = true, timeoutMs }: Omit<RequestParams, "method" | "data">) {
    return request<T>({ url, bearer, timeoutMs, method: "GET" });
  },

  post<T>({ url, data, bearer = true, timeoutMs }: Omit<RequestParams, "method">) {
    return request<T>({ url, data, bearer, timeoutMs, method: "POST" });
  },
};

export default ApiServiceFetch;
