import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  activeId: null,
  messages: [],
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setActiveId(state, action) {
      state.activeId = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addLocalMessage(state, action) {
      state.messages.push(action.payload);
    },
    removeConversationLocal(state, action) {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
      if (state.activeId === action.payload) {
        state.activeId = null;
        state.messages = [];
      }
    },
    addConversationLocal(state, action) {
      state.conversations.unshift(action.payload);
    },
  },
});

export const {
  setConversations, setActiveId, setMessages,
  addLocalMessage, removeConversationLocal, addConversationLocal,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;