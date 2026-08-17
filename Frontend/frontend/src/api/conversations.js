import request from "./client";

export function createConversation(title = null) {
  return request("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function listConversations() {
  return request("/conversations");
}

export function getMessages(conversationId) {
  return request(`/conversations/${conversationId}/messages`);
}

export function deleteConversationApi(conversationId) {
  return request(`/conversations/${conversationId}`, { method: "DELETE" });
}