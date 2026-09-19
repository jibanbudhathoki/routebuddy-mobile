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

import { getAccessToken, getAuthSession, saveAuthSession } from '../../features/auth/services/authStorage';

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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getAuthSession();
        if (!session?.refreshToken) {
          throw new Error("No refresh token available");
        }

        // Import the JSON file directly to read the API key
        const googleServices = require('../../../google-services.json');
        const apiKey = googleServices.client[0].api_key[0].current_key;

        if (!apiKey) {
          throw new Error("Could not find API key in google-services.json");
        }

        // Call Firebase REST API directly using the key from google-services.json
        const refreshResponse = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
          {
            grant_type: 'refresh_token',
            refresh_token: session.refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.id_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        // Save new session
        await saveAuthSession({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: session.user,
        });

        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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