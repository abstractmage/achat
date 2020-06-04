import { all } from 'redux-saga/effects';

import indexPageSaga from './index-page/saga';
import usersPageSaga from './users-page/saga';


export default function* rootSaga() {
  yield all([
    indexPageSaga(),
    usersPageSaga(),
  ]);
}
