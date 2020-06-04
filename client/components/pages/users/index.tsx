import React from 'react';

import './styles.scss';
import UsersQuery from './users-query';
import { UsersContext } from '~/pages/users';
import useDispatch from '~/store/dispatch';
import { setQuery } from '~/store/users-page/actions';
import UsersList from './users-list';
import UsersMore from './users-more';


function Users() {
  const state = React.useContext(UsersContext);
  const dispatch = useDispatch();

  return (
    <div className="users">
      <UsersQuery query={state.query} onChange={val => dispatch(setQuery(val))} />
      <UsersList />
      <UsersMore />
    </div>
  );
}


export default Users;
