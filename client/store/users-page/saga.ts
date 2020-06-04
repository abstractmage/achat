import { all, takeEvery, call, put, select } from 'redux-saga/effects';

import { ActionUsersPageRequestUsers } from './types';
import { getUsers, GetUsersResult } from '~/utils/api';
import { setUsers } from './actions';
import { AxiosResponse } from 'axios';
import { AppState } from '../types';


function* workerRequestUsers({ query }: ActionUsersPageRequestUsers) {
  const result: AxiosResponse<GetUsersResult> = yield call(getUsers, query);
  
  yield put(setUsers(result.data));
}

function* watchRequestUsers() {
  yield takeEvery('USERS-PAGE/REQUEST-USERS', workerRequestUsers);
}

function* workerRequestMoreUsers() {
  const state: AppState = yield select();

  if (!state.usersPage.users) return;

  const result = yield call(getUsers, state.usersPage.query, state.usersPage.users.limit + 10);

  yield put(setUsers(result.data));
}

function* watchRequestMoreUsers() {
  yield takeEvery('USERS-PAGE/REQUEST-MORE-USERS', workerRequestMoreUsers);
}

function* watchUsersPage() {
  yield all([
    watchRequestUsers(),
    watchRequestMoreUsers(),
  ]);
}

export default watchUsersPage;
