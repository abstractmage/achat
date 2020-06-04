import React from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Cookies from 'js-cookie';

import Button from '~/components/button';
import { userSelector } from '~/store/user/selectors';
import useDispatch from '~/store/dispatch';
import { outUser } from '~/store/user/actions';


const generateColor = (id: string) => {
  const lastChar = id[id.length - 1];

  if (/[01234]/g.test(lastChar)) return 'green';
  else if (/[56789]/g.test(lastChar)) return 'orange';
  
  return 'red';
};

const getInitials = (nickname: string) => {
  const words = nickname.split(' ');

  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return words[0][0].toUpperCase();
};

function ProfileUser() {
  const user = useSelector(userSelector)!;
  const dispatch = useDispatch();

  const handleSignOutClick = () => {
    Cookies.remove('access-token');
    Cookies.remove('refresh-token');
    window.localStorage.setItem('logout', Date.now().toString());
    dispatch(outUser());
    Router.push('/', '/', { shallow: true });
  };

  return (
    <div className="profile">
      <div className="profile__avatar-container">
        <div className="profile__avatar">
          <div className={cx(
            'profile__avatar-inner',
            `profile__avatar-inner_${generateColor(user._id)}`,
            'profile__avatar-inner_text'
          )}>
            {getInitials(user.nickname)}
          </div>
        </div>
      </div>
      <div className="profile__header">
      <span className="profile__header-text">Hello, {user.nickname}!</span>
      </div>
      {/* <div className="profile__semi-header">
        <span className="profile__semi-header-text">you can:</span>
      </div> */}
      <Button
        className="profile__button"
        onClick={handleSignOutClick}
      >
        Sign out
      </Button>
    </div>
  );
}


export default ProfileUser;
