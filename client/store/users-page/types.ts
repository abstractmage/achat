import Pagination from "~/types/pagination";
import User from "~/types/user";

export interface UsersPageState {
  query: string;
  users: Pagination<User> | null;
  state: 'empty' | 'loading' | 'loaded';
}

export interface ActionUsersPageRequestUsers {
  query: string;
  type: 'USERS-PAGE/REQUEST-USERS';
}

export interface ActionUsersPageRequestMoreUsers {
  type: 'USERS-PAGE/REQUEST-MORE-USERS';
}

export interface ActionUsersPageSetUsers {
  type: 'USERS-PAGE/SET-USERS';
  users: Pagination<User>;
}

export interface ActionUsersPageSetQuery {
  type: 'USERS-PAGE/SET-QUERY';
  query: string;
}

export interface ActionUsersPageCreateChatRequest {
  type: 'USERS-PAGE/CREATE-CHAT-REQUEST';
  userId: string;
}

export type ActionUsersPage =
  | ActionUsersPageRequestUsers
  | ActionUsersPageSetUsers
  | ActionUsersPageSetQuery
  | ActionUsersPageRequestMoreUsers
  | ActionUsersPageCreateChatRequest;
