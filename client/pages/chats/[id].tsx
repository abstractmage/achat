import React from 'react';

import api from '~/utils/api';
import ChatComponent from '~/components/pages/chat';
import { AxiosError } from 'axios';
import redirect from '~/utils/redirect';
import PageContext from '~/types/page-context';

function Chat() {
  return (
    <ChatComponent />
  );
}

Chat.getInitialProps = async (ctx: PageContext) => {
  const { store } = ctx;

  console.log(ctx.query.id);

  try {
    await api.prepare(ctx, async () => {
      const [result1, result2] = await Promise.all([
        api.getChat(ctx.query.id as string),
        api.getAuthUser(),
      ]);

      const { data: chat } = result1;
      const { data: { user } } = result2;

      store.chatPage.setChat(chat);
      store.auth.setUser(user);

      return result1;
    });
  } catch (err) {
    console.log(err.response);
    await redirect(ctx);

    // if (err.isAxiosError && err.response) {
    //   const error: AxiosError = err;

    //   if (error.response!.status === 401) {
    //     store.auth.setUser(null);
    //     await redirect(ctx);
    //   }
    // }
  }

  return { isServer: !!ctx.res };
};


export default Chat;
