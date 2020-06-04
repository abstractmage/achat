import User from "~/types/user";


export interface ActionSetUser {
  type: 'USER/SET-USER';
  user: User
}

export interface ActionOutUser {
  type: 'USER/OUT-USER';
}

export type ActionUser =
  | ActionSetUser
  | ActionOutUser;
