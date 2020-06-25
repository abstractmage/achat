import { HYDRATE } from 'next-redux-wrapper';

import { ActionIndexPage, IndexPageState } from "./index-page/types";
import { UsersPageState, ActionUsersPage } from './users-page/types';
import { ChatPageState, ActionChatPage } from './chat-page/types';
import { AuthState, ActionAuth } from './auth/types';


export interface AppState {
  indexPage: IndexPageState;
  usersPage: UsersPageState;
  chatPage: ChatPageState;
  auth: AuthState;
}

export interface AppHydrate {
  type: typeof HYDRATE;
}

export type AppAction =
  | AppHydrate
  | ActionIndexPage
  | ActionUsersPage
  | ActionChatPage
  | ActionAuth;
