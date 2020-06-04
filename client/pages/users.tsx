import React from 'react';
import { NextPageContext } from 'next';
import { useSelector } from 'react-redux';

import UsersComponent from '~/components/pages/users';
import { defaultState } from '~/store/users-page/reducer';
import { AppAction, AppState } from '~/store/types';
import { getUsers } from '~/utils/api';
import { setUsers, requestUsers } from '~/store/users-page/actions';
import { usersPageSelector } from '~/store/users-page/selectors';


export const UsersContext = React.createContext(defaultState);

function Users() {
  const usersPageState = useSelector(usersPageSelector);

  return (
    <UsersContext.Provider value={usersPageState}>
      <UsersComponent/>
    </UsersContext.Provider>
  );
}

Users.getInitialProps = async ({ store, req }: NextPageContext<AppState, AppAction>) => {
  if (req) {
    const result = await getUsers();

    store.dispatch(setUsers(result.data));
  } else {
    store.dispatch(requestUsers());
    getUsers().then(({ data }) => store.dispatch(setUsers(data)))
  }

  const { usersPage } = store.getState();
  
  return usersPage;
};


export default Users;
