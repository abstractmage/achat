import User from "~/types/user";
import { ActionSetUser, ActionOutUser } from "./types";


export const setUser = (user: User): ActionSetUser => ({
  type: 'USER/SET-USER',
  user,
});

export const outUser = (): ActionOutUser => ({ type: 'USER/OUT-USER' });
