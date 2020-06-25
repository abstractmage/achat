import { all, takeEvery, call, put } from 'redux-saga/effects';
import Router from 'next/router';

import api from '~/utils/api';
import { signOut as signOutAction } from './actions';


function* signOut() {
  yield call(api.signOut.bind(api));

  yield all([
    put(signOutAction()),
    call(Router.push, '/', '/', { shallow: true }),
    call(() => window.localStorage.setItem('logout', Date.now().toString()))
  ]);

  yield call(() => window.localStorage.removeItem('logout'));
}

function* watchSignOutRequest() {
  yield takeEvery('AUTH/SIGN-OUT-REQUEST', signOut);
}

function* authSaga() {
  yield all([
    watchSignOutRequest(),
  ]);
}

export default authSaga;
