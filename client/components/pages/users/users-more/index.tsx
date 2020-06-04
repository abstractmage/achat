import React from 'react';

import Button from '~/components/button';
import useDispatch from '~/store/dispatch';
import { requestMore } from '~/store/users-page/actions';
import { UsersContext } from '~/pages/users';



function UsersMore() {
  const { users } = React.useContext(UsersContext);
  const dispatch = useDispatch();

  const handleClick = () => dispatch(requestMore());

  if (!users || !users.hasNextPage) return null;

  return (
    <Button onClick={handleClick}>Load more</Button>
  );
}


export default UsersMore;
