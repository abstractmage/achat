import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import './styles.scss';
import Head from '~/components/head';
import AnonymousSVG from './svg/anonymous.svg';
import Button from '~/components/button';
import ProfileSignIn from './profile-sign-in';
import ProfileSignUp from './profile-sign-up';
import useDispatch from '~/store/dispatch';
import { clearSignIn, clearSignUp } from '~/store/index-page/actions';


export interface ProfileProps {
  activeModal?: 'sign-up' | 'sign-in';
}

function Profile(props: ProfileProps) {
  const { activeModal } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalIn, setModalIn] = React.useState(activeModal === 'sign-in');
  const [modalUp, setModalUp] = React.useState(activeModal === 'sign-up');

  React.useEffect(() => {
    if (router.query.modal === 'sign-in') {
      dispatch(clearSignIn());
      setModalIn(true);
      setModalUp(false);
    } else if (router.query.modal === 'sign-up') {
      dispatch(clearSignUp());
      setModalIn(false);
      setModalUp(true);
    } else {
      setModalIn(false);
      setModalUp(false);
    }
  }, [router.query.modal]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="profile">
        <div className="profile__avatar-container">
          <div className="profile__avatar">
            <div className="profile__avatar-inner">
              <AnonymousSVG />
            </div>
          </div>
        </div>
        <div className="profile__header">
          <span className="profile__header-text">You are a guest</span>
        </div>
        <div className="profile__semi-header">
          <span className="profile__semi-header-text">you can:</span>
        </div>
        <Link href="?modal=sign-in" passHref>
          <Button className="profile__button" component="a">Sign in</Button>
        </Link>
        <Link href="?modal=sign-up" passHref>
          <Button className="profile__button" component="a">Sign up</Button>
        </Link>
        <ProfileSignIn show={modalIn} />
        <ProfileSignUp show={modalUp} />
      </div>
    </>
  );
}


export default Profile;
