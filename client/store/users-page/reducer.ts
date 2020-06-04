import { UsersPageState, ActionUsersPage } from "./types";


export const defaultState: UsersPageState = {
  query: '',
  users: null,
  state: 'empty',
};

const reducer = (state: UsersPageState = defaultState, action: ActionUsersPage): UsersPageState => {
  switch (action.type) {
    case 'USERS-PAGE/SET-USERS': return {
      ...state,
      users: action.users,
      state: 'loaded',
    };
    case 'USERS-PAGE/SET-QUERY': return {
      ...state,
      query: action.query,
    };
    case 'USERS-PAGE/REQUEST-USERS': return {
      ...state,
      state: 'loading',
    };
    case 'USERS-PAGE/REQUEST-MORE-USERS': return {
      ...state,
      state: 'loading',
    };
    default: return state;
  }
};


export default reducer;
