import { observable, action } from 'mobx';
import Chat from '~/types/chat';
import api from '~/utils/api';
import Message from '~/types/message';
import Router from 'next/router';

class ChatPageStore {
  @observable input: string = '';
  @observable chat: Chat | null = null;

  @action setInput = (input: string) => this.input = input;
  @action setChat = (chat: Chat | null) => this.chat = chat;
  @action requestSendMessage = async () => {
    if (!this.chat) return;

    await api.sendMessage(this.input, this.chat._id);

    this.input = '';
  };

  @action addMessage = (message: Message) => {
    if (!this.chat || !this.chat.messages) return;

    this.chat.messages.docs = [message, ...this.chat.messages.docs];
  };

  @action requestMoreMessages = async () => {
    try {
      const { data: chat } = await api.getChat(this.chat!._id, this.chat!.messages!.docs.length + 10);
      this.setChat(chat);
    } catch (err) {
      Router.push('/', '/', { shallow: true });
    }
  };

  hydrate(store: ChatPageStore) {
    if (store.chat) this.setChat(store.chat);
  }
}

export default ChatPageStore;
