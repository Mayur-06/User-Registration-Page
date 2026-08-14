import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  conversations: [
    { id: "seed-1", title: "Getting started", messages: [] },
  ],
  activeId: "seed-1",
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    newConversation: {
      reducer(state, action) {
        state.conversations.unshift(action.payload);
        state.activeId = action.payload.id;
      },
      prepare(title = "New conversation") {
        return { payload: { id: nanoid(), title, messages: [] } };
      },
    },
    selectConversation(state, action) {
      state.activeId = action.payload;
    },
    sendMessage(state, action) {
      const { conversationId, text } = action.payload;
      const convo = state.conversations.find((c) => c.id === conversationId);
      if (convo) {
        convo.messages.push({ role: "user", text, ts: Date.now() });
      }
    },
    deleteConversation(state, action) {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
      if (state.activeId === action.payload) {
        state.activeId = state.conversations[0]?.id ?? null;
      }
    },
  },
});

export const { newConversation, selectConversation, sendMessage, deleteConversation } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;