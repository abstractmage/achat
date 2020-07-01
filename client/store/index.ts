import React from 'react';
import { observable } from 'mobx';
import { useStaticRendering, MobXProviderContext } from 'mobx-react';
import AuthStore from './auth';
import IndexPageStore from './index-page';
import UsersPageStore from './users-page';
import ChatPageStore from './chat-page';
import ChatsPageStore from './chats-page';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(typeof window === 'undefined');

export let store: AppStore | undefined;

class AppStore {
  @observable auth = new AuthStore();
  @observable indexPage = new IndexPageStore();
  @observable usersPage = new UsersPageStore();
  @observable chatPage = new ChatPageStore();
  @observable chatsPage = new ChatsPageStore();

  state: 'filled' | 'empty' = 'empty';

  prepareHydrate = () => this.state = 'empty';

  hydrate(store: AppStore) {
    console.log(
      typeof window === 'undefined'
        ? 'server hydrate'
        : 'client hydrate'
    )

    if (this.state === 'filled') return;

    this.state = 'filled';
    this.auth.hydrate(store.auth);
    this.indexPage.hydrate(store.indexPage);
    this.usersPage.hydrate(store.usersPage);
    this.chatPage.hydrate(store.chatPage);
    this.chatsPage.hydrate(store.chatsPage);
  }
}

export function initializeStore() {
  const isServer = typeof window === 'undefined';

  if (isServer) {	
    const store = new AppStore();
    return store;	
  } else {
    if (!store) {
      store = new AppStore();
    }

    return store;
  }
}

export const useStore = () => {
  const { store } = React.useContext(MobXProviderContext) as { store: AppStore };
  return store;
};

export default AppStore;
