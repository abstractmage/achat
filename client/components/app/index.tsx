import React from 'react';
import { AppProps } from 'next/app';
import Link from 'next/link';
import cx from 'classnames';

import './styles.scss';
import UserSVG from './svg/user.svg';
import MessageSVG from './svg/message.svg';
import UsersSVG from './svg/users.svg';
import { useSyncLogout } from '~/utils/hooks';


function App(props: AppProps) {
  const { pageProps, Component, router } = props;

  useSyncLogout();

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__nav">
          <Link href="/">
            <a
              className={cx(
                'app__nav-link',
                router.route === '/' && 'app__nav-link_active'
              )}
            >
              <div className="app__nav-link-inner">
                <UserSVG />
              </div>
            </a>
          </Link>
          <Link href="/chats">
            <a
              className={cx(
                'app__nav-link',
                router.route === '/chats' && 'app__nav-link_active'
              )}
            >
              <div className="app__nav-link-inner">
                <MessageSVG />
              </div>
            </a>
          </Link>
          <Link href="/users">
            <a
              className={cx(
                'app__nav-link',
                router.route === '/users' && 'app__nav-link_active'
              )}
            >
              <div className="app__nav-link-inner">
                <UsersSVG />
              </div>
            </a>
          </Link>
        </div>
        <div className="app__inner-container">
          <Component {...pageProps} />
        </div>
      </div>
      <div className="app__modals"></div>
    </div>
  );
}


export default App;
