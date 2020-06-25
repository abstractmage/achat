import { all } from 'redux-saga/effects';

import indexPageSaga from './index-page/saga';
import usersPageSaga from './users-page/saga';
import chatPageSaga from './chat-page/saga';
import authSaga from './auth/saga';


export default function* rootSaga() {
  yield all([
    indexPageSaga(),
    usersPageSaga(),
    chatPageSaga(),
    authSaga(),
  ]);
}
