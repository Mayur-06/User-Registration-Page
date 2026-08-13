import request from "./client"

export function signup(data) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  return request("/logout", { method: "POST" }).finally(() => {
    localStorage.removeItem("access_token");
  });
}