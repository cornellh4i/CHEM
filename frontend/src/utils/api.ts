import { SERVER_URL } from "@/utils/constants";
import auth from "@/utils/firebase-client";
import { onAuthStateChanged, User } from "firebase/auth";

interface ApiResponse extends Response {
  data: any;
}

/**
 * Performs a GET request
 *
 * @param url - The resource url
 * @returns A promise of the response
 */
const get = (url: string): Promise<ApiResponse> => {
  return handleRequest("GET", url);
};

/**
 * Performs a POST request
 *
 * @param url - The resource url
 * @param body - The request body
 * @returns A promise of the response
 */
const post = (url: string, body: object): Promise<ApiResponse> => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("POST", url, headers, body);
};

/**
 * Performs a PUT request
 *
 * @param url - The resource url
 * @param body - The request body
 * @returns A promise of the response
 */
const put = (url: string, body: object): Promise<ApiResponse> => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PUT", url, headers, body);
};

/**
 * Performs a PATCH request
 *
 * @param url - The resource url
 * @param body - The request body
 * @returns A promise of the response
 */
const patch = (url: string, body: object): Promise<ApiResponse> => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PATCH", url, headers, body);
};

/**
 * Performs a DELETE request
 *
 * @param url - The resource url
 * @returns A promise of the response
 */
const del = (url: string): Promise<ApiResponse> => {
  return handleRequest("DELETE", url);
};

/**
 * Performs a fetch request
 *
 * @param method - The request method
 * @param url - The resource url
 * @param headers - The request headers
 * @param body - The request body
 * @returns A promise of the response
 */
const handleRequest = async (
  method: string,
  url: string,
  headers?: { [key: string]: string },
  body?: object
): Promise<ApiResponse> => {
  // Wait for Firebase user to be ready (useful on page refresh).
  const waitForUser = async (): Promise<User | null> => {
    if (auth.currentUser) return auth.currentUser;
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        resolve(null);
      }, 1500);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(user);
      });
    });
  };

  const getToken = async (forceRefresh: boolean) => {
    try {
      const user = auth.currentUser ?? (await waitForUser());
      if (!user) return null;
      return await user.getIdToken(forceRefresh);
    } catch {
      return null;
    }
  };

  const makeRequest = async (forceRefreshToken: boolean) => {
    // Build auth header
    let authHeader = {};
    const token = await getToken(forceRefreshToken);
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }

    const options = {
      method: method,
      headers: { ...authHeader, ...headers },
      body: JSON.stringify(body),
    };
    const response = await fetch(SERVER_URL + url, options);
    const content = response.headers.get("Content-Type");
    const data = content?.includes("application/json")
      ? await response.json()
      : await response.blob();
    return { response, data };
  };

  // first attempt (use cached token)
  let { response, data } = await makeRequest(false);

  // If token is invalid or expired, retry once with a fresh token
  if (response.status === 401) {
    ({ response, data } = await makeRequest(true));
  }

  if (response.ok) {
    return Promise.resolve({ ...response, data });
  } else {
    const err: any = new Error(data?.error || "Request failed");
    err.status = response.status;
    err.data = data;
    return Promise.reject(err);
  }
};

const api = { get, post, put, patch, delete: del };

export default api;
