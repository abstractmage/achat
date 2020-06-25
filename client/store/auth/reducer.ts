import { AuthState, ActionAuth } from "./types";

const defaultState: AuthState = {
  user: null,
  accessToken: null,
};

const reducer = (state: AuthState = defaultState, action: ActionAuth): AuthState => {
  switch (action.type) {
    case 'AUTH/SET-USER': return {
      ...state,
      user: action.user,
    };
    case 'AUTH/SET-ACCESS-TOKEN': return {
      ...state,
      accessToken: action.accessToken,
    };
    case 'AUTH/SIGN-IN': return {
      ...state,
      user: action.user,
      accessToken: action.accessToken,
    };
    case 'AUTH/SIGN-OUT': return {
      ...state,
      user: null,
      accessToken: null,
    };
    default: return state;
  }
};

export default reducer;
