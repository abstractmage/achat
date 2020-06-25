import React from 'react';
import { NextPageContext } from 'next';
import { useSelector } from 'react-redux';
import Nookies from 'nookies';

import api from '~/utils/api';
import { defaultState } from '~/store/chat-page/reducer';
import { chatPageSelector } from '~/store/chat-page/selectors';
import { setChat, requestChat } from '~/store/chat-page/actions';
import ChatComponent from '~/components/pages/chat';
import auth from '~/utils/auth';
import { AxiosError } from 'axios';
import { setUser } from '~/store/auth/actions';
import redirect from '~/utils/redirect';
import { AppState, AppAction } from '~/store/types';


export const ChatContext = React.createContext(defaultState);

function Chat() {
  const chatPageState = useSelector(chatPageSelector);

  return (
    <ChatContext.Provider value={chatPageState}>
      <ChatComponent />
    </ChatContext.Provider>
  );
}

Chat.getInitialProps = async (ctx: NextPageContext<AppState, AppAction>) => {
  const { dispatch } = ctx.store;
  const isServer = !!ctx.res;

  try {
    await api.prepare(ctx, async () => {
      const [result1, result2] = await Promise.all([
        api.getChat(ctx.query.id as string),
        api.getAuthUser(),
      ]);
      
      const { data: chat } = result1;
      const { data: { user } } = result2;

      dispatch(setChat(chat));
      dispatch(setUser(user));

      return result1;
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


export default Chat;
