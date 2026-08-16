import request from "./client";

export function askQuestion(conversationId, question) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ conversation_id: conversationId, question }),
  });
}