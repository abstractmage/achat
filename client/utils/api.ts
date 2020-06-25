import Axios, { AxiosError, AxiosResponse } from 'axios';

import { apiURL } from '~/app.config';
import getFinger from './get-finger';
import User from '~/types/user';
import Pagination from '~/types/pagination';
import Chat from '~/types/chat';
import Message from '~/types/message';
import { NextPageContext } from 'next';
import { AppState, AppAction } from '~/store/types';


export interface SendMessageResult {
  message: Message;
  user: User;
}

export interface SignInResultData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type SignInResult = AxiosResponse<SignInResultData>;
export type SignInValidationError = AxiosError<{
  name: 'ValidationError';
  message: string;
  errors: {
    [key in 'email' | 'password']: {
      value: any;
      message: string;
    };
  }
}>;

export type IdentificationResult = { user: User | null; }
export type GetUsersResult = Pagination<User>;
export type GetChatResult = Chat;
export interface RefreshTokensResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type CreateChatResult = { chat: Chat };

class Api {
  axios = Axios.create({
    baseURL: apiURL,
    withCredentials: true,
  });


  pushCookies(cookieHeader: string) {
    this.axios.defaults.headers['Cookie'] = cookieHeader;
  }

  
  async prepare(ctx: NextPageContext<AppState, AppAction>, action: (...params: any) => Promise<AxiosResponse>) {
    const isServer = !!ctx.req;

    if (isServer) {
      ctx.req!.headers['cookie'] && this.pushCookies(ctx.req!.headers['cookie']);
    }

    const { headers } = await action();

    if (isServer) {
      headers['set-cookie'] && ctx.res!.setHeader('Set-Cookie', headers['set-cookie']);
    }
  }


  async signIn(email: string, password: string) {
    const fingerprint = await getFinger();

    return this.axios.post<SignInResult>('/auth/sign-in', {
      email,
      password,
      fingerprint,
    });
  }


  async signOut() {
    return this.axios.post('/auth/sign-out');
  }


  async getAuthUser() {
    return this.axios.get<IdentificationResult>('/auth/user');
  }


  async refreshTokens() {
    return this.axios.post<RefreshTokensResult>('/auth/refresh-tokens');
  }


  async getUsers(query?: string, count?: number, withAuthUser: boolean = false) {
    return this.axios.get<GetUsersResult>('/users', {
      params: {
        query,
        'pagination[limit]': count,
        'with-auth-user': withAuthUser,
      },
    });
  }


  async getChat(id: string) {
    return this.axios.get<GetChatResult>(`/chat/${id}`);
  }


  async createChat(userId: string) {
    return this.axios.post<CreateChatResult>('/chat', { userId });
  }

  
  async sendMessage(value: string, chatId: string) {
    return this.axios.post<SendMessageResult>('/message', { value, chatId });
  }
}


export default new Api;
