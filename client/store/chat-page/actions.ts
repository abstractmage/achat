import { ActionChatPageRequestChat, ActionChatPageSetChat, ActionChatPageSetInput, ActionChatPageRequestMessage, ActionChatPageAddMessage } from './types';
import Chat from '~/types/chat';
import Message from '~/types/message';


export const requestChat = (id: string): ActionChatPageRequestChat => ({
  type: 'CHAT-PAGE/REQUEST-CHAT',
  id,
});

export const setChat = (chat: Chat): ActionChatPageSetChat => ({
  type: 'CHAT-PAGE/SET-CHAT',
  chat,
});

export const setInput = (val: string): ActionChatPageSetInput => ({
  type: 'CHAT-PAGE/SET-INPUT',
  value: val,
});

export const sendMessage = (val: string): ActionChatPageRequestMessage => ({
  type: 'CHAT-PAGE/REQUEST-MESSAGE',
  value: val,
});

export const addMessage = (message: Message): ActionChatPageAddMessage => ({
  type: 'CHAT-PAGE/ADD-MESSAGE',
  message,
});
