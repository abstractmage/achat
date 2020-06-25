import Chat from "~/types/chat";
import Message from "~/types/message";

export interface ChatPageState {
  chat: Chat | null;
  state: 'empty' | 'loading' | 'loaded';
  input: string;
}

export interface ActionChatPageRequestChat {
  type: 'CHAT-PAGE/REQUEST-CHAT';
  id: string;
}

export interface ActionChatPageSetChat {
  type: 'CHAT-PAGE/SET-CHAT';
  chat: Chat;
}

export interface ActionChatPageSetInput {
  type: 'CHAT-PAGE/SET-INPUT';
  value: string;
}

export interface ActionChatPageRequestMessage {
  type: 'CHAT-PAGE/REQUEST-MESSAGE';
  value: string;
}

export interface ActionChatPageAddMessage {
  type: 'CHAT-PAGE/ADD-MESSAGE';
  message: Message;
}

export type ActionChatPage =
  | ActionChatPageRequestChat
  | ActionChatPageSetChat
  | ActionChatPageSetInput
  | ActionChatPageRequestMessage
  | ActionChatPageAddMessage;
