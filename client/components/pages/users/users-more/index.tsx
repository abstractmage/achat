import React from 'react';
import { observer } from 'mobx-react';
import Button from '~/components/button';
import { useStore } from '~/store';

function UsersMore() {
  const { usersPage: { users, requestMoreUsers } } = useStore();

  if (!users || !users.hasNextPage) return null;

  return (
    <Button onClick={requestMoreUsers}>Load more</Button>
  );
}

export default observer(UsersMore);
