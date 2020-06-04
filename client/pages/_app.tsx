import React from 'react';
import App, { AppContext } from 'next/app';
import withReduxSaga from 'next-redux-saga';
import Router from 'next/router';

import AppComponent from '~/components/app';
import wrapper from '~/store/init-store';
import { identification } from '~/utils/api';
import { setUser } from '~/store/user/actions';


class WrappedApp extends App {
  static async getInitialProps(appContext: AppContext) {
    const { ctx } = appContext;

    if (ctx.req && ctx.res) {
      const result = await identification(ctx.req.headers.cookie);
      const { data: { user } } = result;
      
      if (user) {
        const { headers } = result;

        ctx.store.dispatch(setUser(user));
        headers['set-cookie'] && ctx.res.setHeader('Set-Cookie', headers['set-cookie']);
      }
    }

    const appProps = await App.getInitialProps(appContext);

    return { ...appProps }
  }


  render() {
    return <AppComponent {...this.props} />
  }
}


export default wrapper.withRedux(withReduxSaga(WrappedApp));
