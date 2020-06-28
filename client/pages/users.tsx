import React from 'react';
import { AxiosError } from 'axios';

import UsersComponent from '~/components/pages/users';
import api from '~/utils/api';
import redirect from '~/utils/redirect';
import PageContext from '~/types/page-context';

function Users() {
  return (
    <UsersComponent />
  );
}

Users.getInitialProps = async (ctx: PageContext) => {
  const { store } = ctx;
  
  try {
    await api.prepare(ctx, async () => {
      const result = await api.getUsers();
      const { data: users } = result;
      
      store.usersPage.users = users;

      return result;
    });
  } catch (err) {
    console.log(err.response);
    if (err.isAxiosError && err.response) {
      const error: AxiosError = err;

      if (error.response!.status === 401) {
        await redirect(ctx);
      }
    }
  }

  return { isServer: !!ctx.req };
};

export default Users;
