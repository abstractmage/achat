import React from 'react';

import './styles.scss';
import getInitials from '~/utils/get-initials';
import generateColor from '~/utils/generate-color';
import Item from '~/components/item';
import { observer } from 'mobx-react';
import { useStore } from '~/store';


function UsersList() {
  const { usersPage: { users } } = useStore();

  return (
    users
      ? (
        <div className="users__list">
          {
            users.docs.map(user => (
              <Item
                key={user._id}
                image={{
                  initials: getInitials(user.nickname),
                  color: generateColor(user._id)
                }}
                first={user.nickname}
                second={user.email}
                onClick={() => console.log({ ...user }) /* dispatch(createChatRequest(user._id)) */}
                hoverable
              />
            ))
          }
        </div>
      )
      : null
  );
}


export default observer(UsersList);
