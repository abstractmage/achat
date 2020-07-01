import { observable, action, reaction } from 'mobx';
import User from '~/types/user';
import api from '~/utils/api';
import IO from '~/utils/io';

class AuthStore {
  @observable user: User | null = null;

  @action setUser = (user: User | null) => {
    this.user = user;
  };

  @action logout = async () => {
    try {
      await api.signOut();
      window.localStorage.setItem('logout', Date.now().toString());
      this.user = null;
    } catch (err) {
      console.log('auth logout ---', err);
    }
  };

  userReaction = reaction(
    () => this.user,
    user => {
      if (user === null && typeof window !== 'undefined') {
        IO.disconnect();
      } else if (user && typeof window !== 'undefined') {
        IO.getInstance();
      }
    },
  );

  @action hydrate(store: AuthStore) {
    this.setUser(store.user);
  }
}

export default AuthStore;