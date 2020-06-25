import User from "~/types/user";
import { ActionAuthSetUser, ActionAuthSetAccessToken, ActionAuthSignIn, ActionAuthSignOut, ActionAuthSignOutRequest } from "./types";

export const setUser = (user: User | null): ActionAuthSetUser =>
  ({ type: 'AUTH/SET-USER', user });

export const setAccessToken = (accessToken: string | null): ActionAuthSetAccessToken =>
  ({ type: 'AUTH/SET-ACCESS-TOKEN', accessToken });

export const signIn = (user: User, accessToken: string): ActionAuthSignIn =>
  ({ type: 'AUTH/SIGN-IN', user, accessToken });

export const signOut = (): ActionAuthSignOut =>
  ({ type: 'AUTH/SIGN-OUT' });

export const signOutRequest = (): ActionAuthSignOutRequest =>
  ({ type: 'AUTH/SIGN-OUT-REQUEST' });
