import React from 'react';
import Router from 'next/router';

import './styles.scss';
import Modal from '~/components/modal';
import Input from '~/components/input';
import Button from '~/components/button';
import { useSignInSelector } from '~/store/index-page/selectors';
import { changeSignInInput, setSignInValidationResult, signInRequest } from '~/store/index-page/actions';
import useDispatch from '~/store/dispatch';
import validate, { email as emailRule, required, match } from '~/utils/validate';


interface ProfileSignInProps {
  show: boolean;
}

const validateSubmit = (email: string, password: string) => {
  return validate({ email, password }, {
    email: [required(), emailRule()],
    // eslint-disable-next-line no-useless-escape
    password: [required(), match(/[a-zA-Z0-9!@#\$%\^&\*\./]{6,}/g)],
  });
};

function ProfileSignIn(props: ProfileSignInProps) {
  const { show } = props;
  const formRef = React.useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const { email, password } = useSignInSelector();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = await validateSubmit(email.value, password.value);

    if (!validationResult.success) {
      dispatch(setSignInValidationResult({
        email: {
          value: email.value,
          state: validationResult.fields.email.success ? 'success' : 'error',
          message: validationResult.fields.email.message,
        },
        password: {
          value: password.value,
          state: validationResult.fields.password.success ? 'success' : 'error',
          message: validationResult.fields.password.message,
        },
      }));

      return;
    }

    formRef.current && Array.from(formRef.current.elements).forEach(el => {
      if (el instanceof HTMLInputElement) el.blur();
    });

    dispatch(signInRequest(email.value, password.value));
  };

  return (
    <Modal show={show} onClose={() => Router.push('/')} container={null}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="profile__modal-header">
          <span className="profile__modal-header-text">Sign in form</span>
        </div>
        <Input
          className="profile__input"
          placeholder="email"
          value={email.value}
          onChange={val => dispatch(changeSignInInput('email', val))}
          state={email.state}
        />
        <Input
          className="profile__input"
          placeholder="password"
          value={password.value}
          onChange={val => dispatch(changeSignInInput('password', val))}
          state={password.state}
        />
        <Button className="profile__modal-button" component="button" clickable>Sign in</Button>
      </form>
    </Modal>
  );
}


export default ProfileSignIn;
