import request from "./client";

export function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/documents/upload", {
    method: "POST",
    body: formData,
    headers: {}, // let the browser set the correct multipart Content-Type + boundary
  });
}

export function listDocuments() {
  return request("/documents");
}

export function deleteDocument(filename) {
  return request(`/documents/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
}