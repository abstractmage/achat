import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

import indexPage from './index-page/reducer';
import usersPage from './users-page/reducer';
import chatPage from './chat-page/reducer';
import auth from './auth/reducer';


const combinedReducer = combineReducers({
  indexPage,
  usersPage,
  chatPage,
  auth,
});

const reducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case HYDRATE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: return combinedReducer(state, action);
  }
};


export default reducer;
