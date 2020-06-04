import { ActionUsersPageRequestUsers, ActionUsersPageSetUsers, ActionUsersPageSetQuery, ActionUsersPageRequestMoreUsers } from "./types";
import Pagination from "~/types/pagination";
import User from "~/types/user";

export const requestUsers = (query: string): ActionUsersPageRequestUsers =>
  ({ type: 'USERS-PAGE/REQUEST-USERS', query });

export const requestMore = (): ActionUsersPageRequestMoreUsers =>
  ({ type: 'USERS-PAGE/REQUEST-MORE-USERS' });

export const setUsers = (users: Pagination<User>): ActionUsersPageSetUsers =>
  ({ type: 'USERS-PAGE/SET-USERS', users });

export const setQuery = (query: string): ActionUsersPageSetQuery =>
  ({ type: 'USERS-PAGE/SET-QUERY', query });
