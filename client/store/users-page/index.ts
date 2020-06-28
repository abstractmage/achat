import { observable, action } from 'mobx';
import Pagination from '~/types/pagination';
import User from '~/types/user';
import api from '~/utils/api';

class UsersPageStore {
  @observable users: Pagination<User> | null = null;
  @observable query: string = '';

  @action setQuery = (val: string) => this.query = val;
  @action setUsers = (users: Pagination<User> | null) => this.users = users;

  @action requestUsers = async () => {
    const { data: users } = await api.getUsers(this.query);
    this.setUsers(users);
  };

  @action requestMoreUsers = async () => {
    if (!this.users) return this.requestUsers();

    const { data: users } = await api.getUsers(this.query, this.users.docs.length + 10);

    this.setUsers(users);
  };

  hydrate(store: UsersPageStore) {
    if (store.users) this.users = store.users;
  }
}

export default UsersPageStore;
