import React from 'react';
import { useSelector } from 'react-redux';

import './styles.scss';
import Head from '~/components/head';
import ProfileGuest from './profile-guest';
import { userSelector } from '~/store/selectors';
import ProfileUser from './profile-user';


export interface ProfileProps {
  activeModal?: 'sign-up' | 'sign-in';
}

function Profile(props: ProfileProps) {
  const { activeModal } = props;
  const { user } = useSelector(userSelector);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {
        user
          ? <ProfileUser />
          : <ProfileGuest activeModal={activeModal} />
      }
    </>
  );
}


export default Profile;
