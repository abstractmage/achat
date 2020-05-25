import { combineReducers, createStore, applyMiddleware, AnyAction } from 'redux';
import reduxLogger from 'redux-logger';
import { createWrapper, MakeStore, Context, HYDRATE } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';

import { AppState, AppAction } from './types';
import indexPage from './index-page/reducer';
import rootSaga from './saga';


const combinedReducer = combineReducers({
  indexPage,
});

const reducer = (state: any = {}, action: AnyAction) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
    };
  }

  return combinedReducer(state, action as AppAction);
};

const makeStore: MakeStore<AppState> = (ctx: Context) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    applyMiddleware(reduxLogger, sagaMiddleware),
  );

  (store as any).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export default createWrapper<AppState>(makeStore);
