const API_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'http://3.7.255.161:5001')
  : (process.env.INTERNAL_API_URL || 'http://localhost:5001');

type ApiOptions = Omit<RequestInit, 'body'> & {
  json?: unknown;
  form?: FormData;
  query?: Record<string, string | number | boolean | null | undefined>;
  param?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  let url = `${API_URL}${endpoint}`;

  if (options.param) {
    for (const [key, value] of Object.entries(options.param)) {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    }
  }

  if (options.query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = new Headers(options.headers);

  let body: BodyInit | undefined;
  if (options.json) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.json);
  } else if (options.form) {
    if (options.form instanceof FormData) {
      body = options.form;
    } else {
      const formData = new FormData();
      for (const [key, value] of Object.entries(options.form)) {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      }
      body = formData;
    }
    // Note: Do not set Content-Type for FormData, the browser will set it with the correct boundary
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: options.credentials ?? 'include', // Include cookies by default
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as any)?.error || response.statusText || 'An error occurred',
      data
    );
  }

  return data as T;
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: Omit<ApiOptions, 'json' | 'form' | 'method'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'POST' }),
  put: <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'PUT' }),
  patch: <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'PATCH' }),
  delete: <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
