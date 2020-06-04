import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

import indexPage from './index-page/reducer';
import usersPage from './users-page/reducer';
import user from './user/reducer';


const combinedReducer = combineReducers({
  indexPage,
  usersPage,
  user,
});

const reducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case HYDRATE: {
      if (action.payload.user === null) {
        delete action.payload.user;
      }

      return {
        ...state,
        ...action.payload,
      };
    }
    default: return combinedReducer(state, action);
  }
};


export default reducer;
