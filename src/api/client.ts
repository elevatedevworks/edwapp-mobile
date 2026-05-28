/****Server url ******/

// import Config from 'react-native-config';

// export const API_BASE_URL = Config.API_BASE_URL;

// if (!API_BASE_URL) {
//   throw new Error('API_BASE_URL is not configured');
// }

import { getApiBaseUrl } from '../config/apiEnvironment';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, token } = options;

  /**** Server url */

  // const response = await fetch(`${API_BASE_URL}${path}`, {
  //   method,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //   },
  //   body: body ? JSON.stringify(body) : undefined,
  // });

  const baseUrl = await getApiBaseUrl();

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json?.message ||
      json?.error ||
      `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, json);
  }

  return json as TResponse;
}
