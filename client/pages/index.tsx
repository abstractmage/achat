import React from 'react';
import Profile from '~/components/pages/profile';
import api from '~/utils/api';
import PageContext from '~/types/page-context';

function Index() {
  return (
    <Profile />
  );
}

Index.getInitialProps = async (ctx: PageContext) => {
  const { store } = ctx;

  try {
    await api.prepare(ctx, async () => {
      const result = await api.getAuthUser();
      const { data: { user } } = result;

      store.auth.setUser(user);

      return result;
    });
  } catch (err) {
    console.log(err);
  }

  return { isServer: !!ctx.req };
};

export default Index;
