import React from 'react';
import { observable } from 'mobx';
import { useStaticRendering, MobXProviderContext } from 'mobx-react';
import AuthStore from './auth';
import IndexPageStore from './index-page';
import UsersPageStore from './users-page';
import ChatPageStore from './chat-page';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(typeof window === 'undefined');

export let store: AppStore | undefined;

class AppStore {
  @observable auth = new AuthStore();
  @observable indexPage = new IndexPageStore();
  @observable usersPage = new UsersPageStore();
  @observable chatPage = new ChatPageStore();

  hydrate(store: AppStore) {
    this.auth.hydrate(store.auth);
    this.indexPage.hydrate(store.indexPage);
    this.usersPage.hydrate(store.usersPage);
    this.chatPage.hydrate(store.chatPage);
  }
}

export function initializeStore(initialData: AppStore | null = null) {
  const isServer = typeof window === 'undefined';

  if (isServer) {	
    const store = new AppStore();
    initialData && store.hydrate(initialData);
    return store;	
  } else {
    if (!store) {
      store = new AppStore();
      initialData && store.hydrate(initialData);
    }

    return store;
  }
}

export const useStore = () => {
  const { store } = React.useContext(MobXProviderContext) as { store: AppStore };
  return store;
};

export default AppStore;
