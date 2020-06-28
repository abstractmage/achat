import React from 'react';
import cx from 'classnames';
import Button from '~/components/button';
import generateColor from '~/utils/generate-color';
import User from '~/types/user';

interface ProfileUserProps {
  user: User;
  logout: Function;
}

const getInitials = (nickname: string) => {
  const words = nickname.split(' ');

  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return words[0][0].toUpperCase();
};

function ProfileUser(props: ProfileUserProps) {
  const { user, logout } = props;

  const handleSignOutClick = () => {
    logout();
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
      <div className="profile__semi-header">
        <span className="profile__semi-header-text">you can:</span>
      </div>
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
