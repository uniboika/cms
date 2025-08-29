import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Try to get token from both localStorage locations for backward compatibility
  const token = localStorage.getItem('token') || 
               (() => {
                 try {
                   const authData = localStorage.getItem('auth');
                   return authData ? JSON.parse(authData).token : null;
                 } catch (e) {
                   return null;
                 }
               })();
  
  const headers: Record<string, string> = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`Making ${method} request to ${url}`, {
    headers,
    hasData: !!data,
    tokenPresent: !!token
  });

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`Response from ${method} ${url}:`, {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });

    // Clone the response before reading it
    const responseClone = res.clone();
    
    try {
      const responseData = await responseClone.json();
      console.log('Response data:', responseData);
    } catch (e) {
      console.log('No JSON response body');
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed for ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Try to get token from both localStorage locations for backward compatibility
    const token = localStorage.getItem('token') || 
                 (() => {
                   try {
                     const authData = localStorage.getItem('auth');
                     return authData ? JSON.parse(authData).token : null;
                   } catch (e) {
                     return null;
                   }
                 })();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = queryKey.join("/");
    console.log(`Making GET request to ${url}`, {
      headers,
      tokenPresent: !!token
    });

    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers,
      credentials: "include",
    });

    console.log(`Response from GET ${url}:`, {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('Unauthorized (401) and unauthorizedBehavior is returnNull, returning null');
      return null;
    }

    await throwIfResNotOk(res);
    const responseData = await res.json();
    console.log('Response data:', responseData);
    return responseData;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
