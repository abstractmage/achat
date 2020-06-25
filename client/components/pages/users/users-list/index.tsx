import React from 'react';

import './styles.scss';
import { UsersContext } from '~/pages/users';
import getInitials from '~/utils/get-initials';
import generateColor from '~/utils/generate-color';
import Item from '~/components/item';
import useDispatch from '~/store/dispatch';
import { createChatRequest } from '~/store/users-page/actions';


function UsersList() {
  const { users } = React.useContext(UsersContext);
  const dispatch = useDispatch();

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
                onClick={() => dispatch(createChatRequest(user._id))}
                hoverable
              />
            ))
          }
        </div>
      )
      : null
  );
}


export default UsersList;
