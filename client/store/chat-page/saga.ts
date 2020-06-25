import { all, takeEvery, call, put, select } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import { ActionChatPageRequestChat, ActionChatPageRequestMessage } from './types';
import api, { GetChatResult } from '~/utils/api';
import { setChat, setInput } from './actions';
import { chatIdSelector } from './selectors';


function* requestMessage({ value }: ActionChatPageRequestMessage) {
  try {
    const chatId: string = yield select(chatIdSelector);
    yield call(api.sendMessage.bind(api), value, chatId);
    yield put(setInput(''));
  } catch (err) {
    console.log('requestMessage error ---', err);
  }
}

function* watchRequestMessage() {
  yield takeEvery('CHAT-PAGE/REQUEST-MESSAGE', requestMessage);
}

function* requestChat({ id }: ActionChatPageRequestChat) {
  const { data: chat }: AxiosResponse<GetChatResult> = yield call(api.getChat, id);

  yield put(setChat(chat));
}

function* watchRequestChat() {
  yield takeEvery('CHAT-PAGE/REQUEST-CHAT', requestChat);
}

function* chatPageSaga() {
  yield all([
    watchRequestMessage(),
    watchRequestChat(),
  ]);
}


export default chatPageSaga;
