import User from "~/types/user";

export interface AuthState {
  user: null | User;
  accessToken: null | string;
}

export interface ActionAuthSetUser {
  type: 'AUTH/SET-USER';
  user: null | User;
}

export interface ActionAuthSetAccessToken {
  type: 'AUTH/SET-ACCESS-TOKEN';
  accessToken: null | string;
}

export interface ActionAuthSignIn {
  type: 'AUTH/SIGN-IN';
  user: User;
  accessToken: string;
}

export interface ActionAuthSignOut {
  type: 'AUTH/SIGN-OUT';
}

export interface ActionAuthSignOutRequest {
  type: 'AUTH/SIGN-OUT-REQUEST';
}

export type ActionAuth = 
  | ActionAuthSetUser
  | ActionAuthSetAccessToken
  | ActionAuthSignIn
  | ActionAuthSignOut
  | ActionAuthSignOutRequest;
