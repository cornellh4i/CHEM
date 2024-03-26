import { SERVER_URL } from "@/utils/constants";
import auth from "@/utils/firebase";

/**
 * Performs a GET request
 * @param url is the resource url
 * @param requiresAuth is whether a token is needed for the request
 * @returns a promise of the response
 */
const get = (url: string, requiresAuth = true) => {
  return handleRequest("GET", url, requiresAuth);
};

/**
 * Performs a POST request
 * @param url is the resource url
 * @param body is the request body
 * @param requiresAuth is whether a token is needed for the request
 * @returns a promise of the response
 */
const post = (url: string, body: object, requiresAuth = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("POST", url, requiresAuth, headers, body);
};

/**
 * Performs a PUT request
 * @param url is the resource url
 * @param body is the request body
 * @param requiresAuth is whether a token is needed for the request
 * @returns a promise of the response
 */
const put = (url: string, body: object, requiresAuth = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PUT", url, requiresAuth, headers, body);
};

/**
 * Performs a PATCH request
 * @param url is the resource url
 * @param body is the request body
 * @param requiresAuth is whether a token is needed for the request
 * @returns a promise of the response
 */
const patch = (url: string, body: object, requiresAuth = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PATCH", url, requiresAuth, headers, body);
};

/**
 * Performs a DELETE request
 * @param url is the resource url
 * @param requiresAuth is whether a token is needed for the request
 * @returns a promise of the response
 */
const del = (url: string, requiresAuth = true) => {
  return handleRequest("DELETE", url, requiresAuth);
};

/**
 * Retrieves the Firebase token for the current user
 * @returns a promise of the token
 */
const retrieveToken = (): Promise<string> => {
  if (auth.currentUser) {
    return auth.currentUser.getIdToken();
  } else {
    return Promise.reject(new Error("Failed to retrieve token: user is null"));
  }
};

/**
 * Performs a fetch request
 * @param method is the request method
 * @param url is the resource url
 * @param requiresAuth is whether a token is needed for the request
 * @param headers are the request headers
 * @param body is the request body
 * @returns a promise of the response data as { response, data }
 */
const handleRequest = async (
  method: string,
  url: string,
  requiresAuth: boolean,
  headers?: { [key: string]: string },
  body?: object
) => {
  // Handle request
  let authHeader = {};
  if (requiresAuth) {
    const token = await retrieveToken();
    authHeader = { Authorization: `Bearer ${token}` };
  }
  const options = {
    method: method,
    headers: { ...authHeader, ...headers },
    body: JSON.stringify(body),
  };
  const response = await fetch(SERVER_URL + url, options);

  // Handle response
  const content = response.headers.get("Content-Type");
  const data = content?.includes("application/json")
    ? await response.json()
    : await response.blob();
  if (response.ok) {
    return Promise.resolve({ ...response, data });
  } else {
    return Promise.reject(new Error(data.error));
  }
};

const api = { get, post, put, patch, delete: del };

export default api;
