import React from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react';
import './styles.scss';
import SearchSVG from './svg/search.svg';
import { useStore } from '~/store';

const useFocus = () => {
  const [focused, setFocus] = React.useState(true);
  const focus = () => setFocus(true);
  const blur = () => setFocus(false);

  return [focused, focus, blur] as [boolean, () => void, () => void];
};

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
  const [focused, focus, blur] = useFocus();
  useSubmit(query, requestUsers);

  return (
    <div className="users__query">
      <div className={cx('users__query-inner', { 'users__query-inner_focus': focused })}>
        <div className="users__query-icon">
          <SearchSVG />
        </div>
        <input
          type="text"
          className="users__query-input"
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
          onFocus={focus}
          onBlur={blur}
          placeholder="Search..."
          autoFocus
        />
      </div>
    </div>
  );
}

export default observer(UsersQuery);
