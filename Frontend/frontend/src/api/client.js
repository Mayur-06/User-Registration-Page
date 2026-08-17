const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// const BASE_URL= " https://199e-49-36-186-18.ngrok-free.app" 

const AUTH_ENDPOINTS = ["/login", "/signup", "/refresh", "/logout"];

let isRefreshing = false;
let refreshPromise = null;

async function tryRefresh() {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    })
    .finally(() => {
      isRefreshing = false;
    });
  return refreshPromise;
}

async function request(path, options = {}, isRetry = false) {
  const token = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;
  // const headers = {
  //   "Content-Type": "application/json",
  //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //   ...options.headers,
  // };
  const headers = {
  ...(isFormData ? {} : { "Content-Type": "application/json" }),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...options.headers,
};

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const isAuthEndpoint = AUTH_ENDPOINTS.includes(path);

  // Only attempt the refresh-and-retry dance for non-auth endpoints
  if (response.status === 401 && !isRetry && !isAuthEndpoint) {
    try {
      await tryRefresh();
      return request(path, options, true);
    } catch {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return;
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Something went wrong");
  }

  return response.status === 204 ? null : response.json();
}

export default request;