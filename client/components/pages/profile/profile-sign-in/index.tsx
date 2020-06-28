import React from 'react';
import Router from 'next/router';
import { observer } from 'mobx-react';
import _ from 'lodash';
import './styles.scss';
import Modal from '~/components/modal';
import Input from '~/components/input';
import Button from '~/components/button';
import { useStore } from '~/store';

function ProfileSignIn() {
  const { indexPage: { signInModal: { opened, form }, submit, changeValue }, auth: { setUser } } = useStore();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(user => {
      setUser(user);
      Router.push('/', '/', { shallow: true });
    });
  };

  return (
    <Modal show={opened} onClose={() => Router.push('/', '/', { shallow: true })} container={null}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="profile__modal-header">
          <span className="profile__modal-header-text">Sign in form</span>
        </div>
        {
          _.entries(form).map(([field, { value, state }], i) => (
            <Input
              key={i}
              className="profile__input"
              type={field === 'password' ? 'password' : 'text'}
              placeholder={field}
              value={value}
              onChange={val => changeValue('sign-in', field as 'email' | 'password', val)}
              state={state}
            />
          ))
        }
        <Button className="profile__modal-button" component="button" clickable>Sign in</Button>
      </form>
    </Modal>
  );
}


export default observer(ProfileSignIn);
