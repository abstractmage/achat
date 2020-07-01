import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '~/store';
import QueryInput from '~/components/query-input';

const useSubmit = (query: string, request: () => void) => {
  const firstEffect = React.useRef(true);
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    timeout.current && clearTimeout(timeout.current);

    if (!firstEffect.current) timeout.current = setTimeout(request, 1000);

    firstEffect.current = false;
  }, [query, request]);
};

function UsersQuery() {
  const { usersPage: { query, setQuery, requestUsers } } = useStore();

  useSubmit(query, requestUsers);

  return <QueryInput query={query} onChange={setQuery} />;
}

export default observer(UsersQuery);
