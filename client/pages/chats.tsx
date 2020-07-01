import React from 'react';
import PageContext from '~/types/page-context';
import api from '~/utils/api';
import redirect from '~/utils/redirect';
import ChatsComponent from '~/components/pages/chats';

function Chats() {
  return (
    <ChatsComponent />
  );
}

Chats.getInitialProps = async (ctx: PageContext) => {
  const { store } = ctx;
  
  try {
    await api.prepare(ctx, async () => {
      const [result1, result2] = await Promise.all([
        api.getChats(),
        api.getAuthUser(),
      ]);

      const { data: chats } = result1;
      const { data: { user } } = result2;
      
      store.chatsPage.setChats(chats);
      store.auth.setUser(user);

      return result1;
    });
  } catch (err) {
    console.log(err.response);
    await redirect(ctx);

    // if (err.isAxiosError && err.response) {
    //   const error: AxiosError = err;

    //   if (error.response!.status === 401) {
    //     await redirect(ctx);
    //   }
    // }
  }

  return { isServer: !!ctx.req };
};

export default Chats;
