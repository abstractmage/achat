import React from 'react';
import { NextPageContext } from 'next';
import { useSelector } from 'react-redux';

import UsersComponent from '~/components/pages/users';
import { defaultState } from '~/store/users-page/reducer';
import { AppAction, AppState } from '~/store/types';
import api from '~/utils/api';
import { usersPageSelector } from '~/store/users-page/selectors';
import { setUsers } from '~/store/users-page/actions';
import { AxiosError } from 'axios';
import redirect from '~/utils/redirect';
import { setUser } from '~/store/auth/actions';


export const UsersContext = React.createContext(defaultState);

function Users() {
  const usersPageState = useSelector(usersPageSelector);

  return (
    <UsersContext.Provider value={usersPageState}>
      <UsersComponent/>
    </UsersContext.Provider>
  );
}

Users.getInitialProps = async (ctx: NextPageContext<AppState, AppAction>) => {
  const { dispatch } = ctx.store;
  const isServer = !!ctx.req;

  try {
    await api.prepare(ctx, async () => {
      const result = await api.getUsers();
      const { data: users } = result;
      
      dispatch(setUsers(users));

      return result;
    });
  } catch (err) {
    console.log(err.response);
    if (err.isAxiosError && err.response) {
      const error: AxiosError = err;

      if (error.response!.status === 401) {
        dispatch(setUser(null));
        await redirect(ctx);
      }
    }
  }

  return { isServer };
};


export default Users;
