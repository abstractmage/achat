import React from 'react';
import cx from 'classnames';

import './styles.scss';


interface InputProps {
  value?: string | number | string[];
  onChange?: (val: string) => void;
  placeholder?: string | number | string[];
  type?: string;
  state?: 'default' | 'error' | 'success';
  inputRef?: React.Ref<HTMLInputElement>;
}

function Input(props: InputProps & Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>) {
  const { value, onChange, placeholder, type, state, inputRef, ...otherProps } = props;
  const [focus, setFocus] = React.useState(false);

  return (
    <div
      {...otherProps}
      className={cx(
        'input',
        focus && 'input_focused',
        `input_${state}`,
        otherProps.className,
      )}
    >
      <input
        ref={inputRef}
        type={type}
        className="input__input"
        value={value}
        onChange={e => onChange!(e.currentTarget.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}

Input.defaultProps = {
  type: 'text',
  state: 'default',
  onChange: () => {},
};


export default Input;
