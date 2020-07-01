import React from 'react';
import cx from 'classnames';
import SearchSVG from './svg/search.svg';
import './styles.scss';

interface QueryInputProps {
  query: string;
  onChange: (val: string) => void;
}

const useFocus = () => {
  const [focused, setFocus] = React.useState(true);
  const focus = () => setFocus(true);
  const blur = () => setFocus(false);

  return [focused, focus, blur] as [boolean, () => void, () => void];
};

function QueryInput(props: QueryInputProps) {
  const { query, onChange } = props;
  const [focused, focus, blur] = useFocus();

  return (
    <div className="query-input">
      <div className={cx('query-input__inner', { 'query-input__inner_focus': focused })}>
        <div className="query-input__icon">
          <SearchSVG />
        </div>
        <input
          type="text"
          className="query-input__input"
          value={query}
          onChange={e => onChange(e.currentTarget.value)}
          onFocus={focus}
          onBlur={blur}
          placeholder="Search..."
          autoFocus
        />
      </div>
    </div>
  )
}

export default QueryInput;
