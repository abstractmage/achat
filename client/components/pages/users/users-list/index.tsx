import React from 'react';
import { observer } from 'mobx-react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './styles.scss';
import getInitials from '~/utils/get-initials';
import generateColor from '~/utils/generate-color';
import Item from '~/components/item';
import { useStore } from '~/store';
import Collapse from '~/components/collapse';

function UsersList() {
  const { usersPage: { users, createChat }, prepareHydrate } = useStore();

  return (
    users
      ? (
        <div className="users__list">
          {/* <TransitionGroup component={null}> */}
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
                  onClick={() => {
                    createChat(user._id).then(prepareHydrate);
                  }}
                  hoverable
                />
              ))
            }
          {/* </TransitionGroup> */}
        </div>
      )
      : null
  );
}


export default observer(UsersList);
