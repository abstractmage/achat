import React from 'react';
import { observer } from 'mobx-react';
import './styles.scss';
import Head from '~/components/head';
import ProfileGuest from './profile-guest';
import ProfileUser from './profile-user';
import { useStore } from '~/store';

function Profile() {
  const { auth: { user, logout } } = useStore();

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {
        user
          ? <ProfileUser user={user} logout={logout} />
          : <ProfileGuest />
      }
    </>
  );
}


export default observer(Profile);
