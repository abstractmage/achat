import React from 'react';
import './styles.scss';
import UsersQuery from './users-query';
import UsersList from './users-list';
import UsersMore from './users-more';

function Users() {
  return (
    <div className="users">
      <UsersQuery />
      <UsersList />
      <UsersMore />
    </div>
  );
}

export default Users;
