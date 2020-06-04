import { HYDRATE } from 'next-redux-wrapper';

import { ActionIndexPage, IndexPageState } from "./index-page/types";
import User from "~/types/user";
import { ActionUser } from './user/types';
import { UsersPageState, ActionUsersPage } from './users-page/types';


export interface AppState {
  indexPage: IndexPageState;
  usersPage: UsersPageState;
  user: User | null;
}

export interface AppHydrate {
  type: typeof HYDRATE;
}

export type AppAction =
  | AppHydrate
  | ActionIndexPage
  | ActionUsersPage
  | ActionUser;
