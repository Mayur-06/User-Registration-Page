import request from "./client"

export function getMe(){
    return request("/me");
}

export function deleteMe(){
    return request("/me", {method: "DELETE"});
}
