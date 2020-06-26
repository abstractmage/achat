import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';
import AnonymousSVG from './svg/anonymous.svg';
import Button from '~/components/button';
import ProfileSignIn from './../profile-sign-in';
import ProfileSignUp from './../profile-sign-up';
import { useStore } from '~/store';

function ProfileGuest() {
  const store = useStore();
  const router = useRouter();

  React.useEffect(() => {
    if (router.query.modal === 'sign-in') store.indexPage.toggleSignIn(true);
    else if (router.query.modal === 'sign-up') store.indexPage.toggleSignUp(true);
    else store.indexPage.closeModals();
  }, [router.query.modal, store.indexPage]);

  return (
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
      <Link href="?modal=sign-in" passHref shallow>
        <Button className="profile__button" component="a">Sign in</Button>
      </Link>
      <Link href="?modal=sign-up" passHref shallow>
        <Button className="profile__button" component="a">Sign up</Button>
      </Link>
      <ProfileSignIn />
      <ProfileSignUp show={store.indexPage.signUpModal.opened} />
    </div>
  );
}


export default observer(ProfileGuest);
