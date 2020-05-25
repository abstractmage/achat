import React from 'react';
import App from 'next/app';
import withReduxSaga from 'next-redux-saga';

import AppComponent from '~/components/app';
import wrapper from '~/store/init-store';


class WrappedApp extends App {
  render() {
    return <AppComponent {...this.props} />
  }
}


export default wrapper.withRedux(withReduxSaga(WrappedApp));
