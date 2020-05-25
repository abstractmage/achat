import { ActionIndexPage, IndexPageState } from "./index-page/types";


export interface AppState {
  indexPage: IndexPageState,
  // usersPage: {},
  // messagesPage: {},
  // auth: {},
}

export type AppAction =
  ActionIndexPage;
