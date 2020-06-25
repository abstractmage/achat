import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import Button from '~/components/button';
import useDispatch from '~/store/dispatch';
import { userSelector } from '~/store/auth/selectors';
import generateColor from '~/utils/generate-color';
import { signOutRequest } from '~/store/auth/actions';


const getInitials = (nickname: string) => {
  const words = nickname.split(' ');

  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return words[0][0].toUpperCase();
};

function ProfileUser() {
  const user = useSelector(userSelector)!;
  const dispatch = useDispatch();

  const handleSignOutClick = () => dispatch(signOutRequest());

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
