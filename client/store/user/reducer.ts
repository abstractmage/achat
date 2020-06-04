import { ActionUser } from "./types";
import User from "~/types/user";

const reducer = (state: User | null = null, action: ActionUser) => {
  switch (action.type) {
    case 'USER/SET-USER': return {
      ...action.user,
    };
    case 'USER/OUT-USER': return null;
    default: return state;
  }
};

export default reducer;
