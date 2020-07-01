import Axios, { AxiosError, AxiosResponse } from 'axios';
import Qs from 'qs';

import { apiURL } from '~/app.config';
import getFinger from './get-finger';
import User from '~/types/user';
import Pagination from '~/types/pagination';
import Chat from '~/types/chat';
import Message from '~/types/message';
import PageContext from '~/types/page-context';


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
export type GetChatsResult = Pagination<{
  _id: string;
  createdAt: string;
  updatedAt: string;
  companion: User;
  message: Message | null;
}>;

class Api {
  axios = Axios.create({
    baseURL: apiURL,
    withCredentials: true,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'brackets' });
    },
  });


  pushCookies(cookieHeader: string) {
    this.axios.defaults.headers['Cookie'] = cookieHeader;
  }

  
  async prepare(ctx: PageContext, action: (...params: any) => Promise<AxiosResponse>) {
    const isServer = !!ctx.req;

    if (isServer) {
      ctx.req!.headers['cookie'] && this.pushCookies(ctx.req!.headers['cookie']);
    }

    const result = await action();
    const { headers } = result;

    if (isServer) {
      headers['set-cookie'] && ctx.res!.setHeader('Set-Cookie', headers['set-cookie']);
    }

    return result;
  }


  async signIn(email: string, password: string) {
    const fingerprint = await getFinger();

    return this.axios.post<SignInResultData>('/auth/sign-in', {
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
        pagination: {
          limit: count,
        },
        'with-auth-user': withAuthUser,
      },
    });
  }


  async getChat(id: string, lastMessages: number = 10) {
    return this.axios.get<GetChatResult>(`/chat/${id}`, {
      params: { lastMessages },
    });
  }


  async createChat(userId: string) {
    return this.axios.post<CreateChatResult>('/chat', { userId });
  }

  
  async sendMessage(value: string, chatId: string) {
    return this.axios.post<SendMessageResult>('/message', { value, chatId });
  }


  async getChats(query?: string, count?: number) {
    return this.axios.get<GetChatsResult>('/chats', {
      params: {
        query,
        pagination: {
          limit: count,
        },
      },
    });
  }
}


export default new Api;
