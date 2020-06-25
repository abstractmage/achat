import React from 'react';
import { NextPageContext } from 'next';

import Profile, { ProfileProps } from '~/components/pages/profile';
import { AppAction, AppState } from '~/store/types';
import api from '~/utils/api';
import { setUser, signOut } from '~/store/auth/actions';
import { AxiosError } from 'axios';


function Index(props: ProfileProps) {
  return (
    <Profile {...props} />
  );
}

Index.getInitialProps = async (ctx: NextPageContext<AppState, AppAction>) => {
  const { dispatch } = ctx.store;

  try {
    await api.prepare(ctx, async () => {
      const result = await api.getAuthUser();
      const { data: { user } } = result;

      dispatch(setUser(user));

      return result;
    });
  } catch (err) {
    console.log(err);
  }

  return {
    activeModal: ctx.query.modal,
  };
};


export default Index;
