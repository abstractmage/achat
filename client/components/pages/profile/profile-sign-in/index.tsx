import React from 'react';
import Router from 'next/router';

import './styles.scss';
import Modal from '~/components/modal';
import Input from '~/components/input';
import Button from '~/components/button';
import { useSignInSelector } from '~/store/index-page/selectors';
import { changeSignInInput } from '~/store/index-page/actions';
import useDispatch from '~/store/dispatch';


interface ProfileSignInProps {
  show: boolean;
}

function ProfileSignIn(props: ProfileSignInProps) {
  const { show } = props;
  const dispatch = useDispatch();
  const { email, password } = useSignInSelector();

  return (
    <Modal show={show} onClose={() => Router.push('/')} container={null}>
      <div className="profile__modal-header">
        <span className="profile__modal-header-text">Sign in form</span>
      </div>
      <Input
        className="profile__input"
        placeholder="email"
        value={email.value}
        onChange={val => dispatch(changeSignInInput('email', val))}
      />
      <Input
        className="profile__input"
        placeholder="password"
        value={password.value}
        onChange={val => dispatch(changeSignInInput('password', val))}
      />
      <Button className="profile__modal-button" component="button">Sign in</Button>
    </Modal>
  );
}


export default ProfileSignIn;
