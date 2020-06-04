import { createStore, applyMiddleware } from 'redux';
import reduxLogger from 'redux-logger';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';

import { AppState } from './types';
import reducer from './reducer';
import rootSaga from './saga';


const makeStore: MakeStore<AppState> = (/* ctx: Context */) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    applyMiddleware(reduxLogger, sagaMiddleware),
  );

  (store as any).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export default createWrapper<AppState>(makeStore);
