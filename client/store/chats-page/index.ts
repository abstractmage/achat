import { observable, action } from 'mobx';
import Pagination from '~/types/pagination';
import User from '~/types/user';
import api from '~/utils/api';
import Chat from '~/types/chat';
import Message from '~/types/message';

interface PageChat extends Omit<Chat, 'users' | 'messages'> {
  companion: User;
  message: Message | null;
}

class ChatsPageStore {
  @observable chats: Pagination<PageChat> | null = null;
  @observable query: string = '';

  @action setQuery = (val: string) => this.query = val;
  @action setChats = (chats: Pagination<PageChat> | null) => this.chats = chats;

  @action requestChats = async () => {
    const { data: chats } = await api.getChats(this.query);
    this.setChats(chats);
  };

  @action requestMoreUsers = async () => {
    if (!this.chats) return this.requestChats();

    /* const { data: users } = await api.getUsers(this.query, this.users.docs.length + 10);

    this.setChats(users); */
  };

  hydrate(store: ChatsPageStore) {
    if (store.chats) this.setChats(store.chats);
  }
}

export default ChatsPageStore;
