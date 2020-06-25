import { AppState } from "../types";

export const chatPageSelector = (state: AppState) => state.chatPage;

export const companionSelector = (state: AppState) => {
  if (state.chatPage.chat && state.chatPage.chat.users && state.auth.user) {
    return state.chatPage.chat.users.docs.find(u => u._id !== state.auth.user!._id) || null;
  }

  return null;
};

export const messagesSelector = (state: AppState) => state.chatPage.chat ? state.chatPage.chat.messages : null;

export const chatIdSelector = (state: AppState) => state.chatPage.chat?._id;
