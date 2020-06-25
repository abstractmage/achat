import _ from 'lodash';
import Router from 'next/router';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { ActionIndexPageSignInRequest } from './types';
import api, { SignInValidationError, SignInResult } from '~/utils/api';
import { setSignInValidationResult } from './actions';
import { signIn } from '../auth/actions';


function* workerSignInRequest({ email, password }: ActionIndexPageSignInRequest) {
  try {
    const result: SignInResult = yield call(api.signIn.bind(api), email, password);

    yield call(Router.push, '/');

    yield put(signIn(result.data.user, result.data.accessToken));
  } catch (err) {
    const error: SignInValidationError = err;

    if (error.response) {
      const errorFields = _.fromPairs(
        _.toPairs(error.response.data.errors)
          .map(pair => ([pair[0], { value: pair[1].value, state: 'error', message: pair[1].message }]))
      );

      yield put(setSignInValidationResult({
        email: {
          value: email,
          state: 'success',
        },
        password: {
          value: password,
          state: 'success',
        },
        ...errorFields,
      }));
    }
  }
}

function* watchSignInRequest() {
  yield takeEvery('INDEX-PAGE/SIGN-IN-REQUEST', workerSignInRequest);
}

function* indexPageSaga() {
  yield all([
    watchSignInRequest(),
  ]);
}

export default indexPageSaga;
