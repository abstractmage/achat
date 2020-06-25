import React from 'react';
import cx from 'classnames';

import './styles.scss';
import SearchSVG from './svg/search.svg';
import useDispatch from '~/store/dispatch';
import { requestUsers } from '~/store/users-page/actions';


interface UsersQueryProps {
  query: string;
  onChange(value: string): void;
}

const useFocus = () => {
  const [focused, setFocus] = React.useState(false);
  const focus = () => setFocus(true);
  const blur = () => setFocus(false);

  return [focused, focus, blur] as [boolean, () => void, () => void];
};

const useSubmit = (query: string, request: () => void) => {
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(request, 1000);
  }, [query, request]);
};

function UsersQuery(props: UsersQueryProps) {
  const { query, onChange } = props;
  const [focused, focus, blur] = useFocus();
  const dispatch = useDispatch();
  const request = React.useCallback(() => dispatch(requestUsers(query)), [query, dispatch]);
  useSubmit(query, request);

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
          onChange={e => onChange(e.currentTarget.value)}
          onFocus={focus}
          onBlur={blur}
          placeholder="Search..."
        />
      </div>
    </div>
  );
}


export default UsersQuery;
