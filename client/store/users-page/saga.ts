import { all, takeEvery, call, put, select } from 'redux-saga/effects';
import Router from 'next/router';

import { ActionUsersPageRequestUsers, ActionUsersPageCreateChatRequest } from './types';
import api, { GetUsersResult, CreateChatResult } from '~/utils/api';
import { setUsers } from './actions';
import { AxiosResponse } from 'axios';
import { AppState } from '../types';


function* requestUsers({ query }: ActionUsersPageRequestUsers) {
  const result: AxiosResponse<GetUsersResult> = yield call(api.getUsers.bind(api), query);
  
  yield put(setUsers(result.data));
}

function* watchRequestUsers() {
  yield takeEvery('USERS-PAGE/REQUEST-USERS', requestUsers);
}

function* requestMoreUsers() {
  const state: AppState = yield select();

  if (!state.usersPage.users) return;

  const result = yield call(api.getUsers.bind(api), state.usersPage.query, state.usersPage.users.limit + 10);

  yield put(setUsers(result.data));
}

function* watchRequestMoreUsers() {
  yield takeEvery('USERS-PAGE/REQUEST-MORE-USERS', requestMoreUsers);
}

function* createChatRequest(action: ActionUsersPageCreateChatRequest) {
  try {
    const { userId } = action;
    const { data: { chat } }: AxiosResponse<CreateChatResult> = yield call(api.createChat.bind(api), userId);

    yield call(Router.push, `/chats/[id]`, `/chats/${chat._id}`, { shallow: true });
  } catch (err) {
    console.log(err);
  }
}

function* watchCreateChatRequest() {
  yield takeEvery('USERS-PAGE/CREATE-CHAT-REQUEST', createChatRequest);
}

function* watchUsersPage() {
  yield all([
    watchRequestUsers(),
    watchRequestMoreUsers(),
    watchCreateChatRequest(),
  ]);
}

export default watchUsersPage;
