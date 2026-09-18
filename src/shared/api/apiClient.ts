import axios, { type AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ApiRequestOptions = Omit<AxiosRequestConfig, 'baseURL' | 'data' | 'headers' | 'timeout' | 'url'> & {
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

import { getAccessToken } from '../../features/auth/services/authStorage';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const defaultTimeoutMs = 15_000;

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError(
      'The API URL is not configured. Add EXPO_PUBLIC_API_URL to your environment.',
      0,
      'API_NOT_CONFIGURED',
    );
  }

  try {
    const { body, headers, timeoutMs, ...requestOptions } = options;
    const response = await apiClient.request<T>({
      ...requestOptions,
      data: body,
      headers: {
        ...(headers || {}),
      },
      method: requestOptions.method ?? 'GET',
      timeout: timeoutMs ?? defaultTimeoutMs,
      url: path,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const payload = error.response?.data;

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new ApiError(
          'The request timed out. Please try again.',
          408,
          'TIMEOUT',
          error,
        );
      }

      if (error.response) {
        throw new ApiError(
          getApiMessage(payload, error.response.statusText),
          error.response.status,
          getApiCode(payload) ?? error.code,
          payload,
        );
      }
    }

    throw new ApiError(
      'Unable to connect to the service. Check your connection and try again.',
      0,
      'NETWORK_ERROR',
      error,
    );
  }
}

function getApiMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }
  
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>;
    
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message;
    }
    
    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error;
    }
    
    if (typeof record.error === 'object' && record.error !== null) {
      const nestedError = record.error as Record<string, unknown>;
      if (typeof nestedError.message === 'string' && nestedError.message.trim()) {
        return nestedError.message;
      }
    }
  }

  return fallback || 'The request could not be completed.';
}

function getApiCode(payload: unknown): string | undefined {
  if (typeof payload === 'object' && payload !== null && 'code' in payload) {
    const code = payload.code;
    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}