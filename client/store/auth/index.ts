import { observable, action } from 'mobx';
import User from '~/types/user';
import api from '~/utils/api';

class AuthStore {
  @observable user: User | null = null;

  @action setUser = (user: User | null) => {
    this.user = user;
  }

  @action logout = async () => {
    try {
      await api.signOut();
      this.user = null;
    } catch (err) {
      console.log('auth logout ---', err);
    }
  }

  hydrate(store: AuthStore) {
    if (store.user) this.user = store.user;
  }
}

export default AuthStore;