import React from 'react';
import cx from 'classnames';

import './styles.scss';


interface ButtonProps {
  type?: 'success' | 'default' | 'error';
  component?: React.ElementType;
  clickable?: boolean;
}

const Button = React.forwardRef(function Button(
  props: ButtonProps & React.HTMLAttributes<HTMLElement>,
  ref?: React.Ref<any>,
) {
  const { type, children, component, clickable, ...otherProps } = props;
  const Component = component!;

  return (
    <Component
      {...otherProps}
      ref={ref}
      className={cx(
        'button',
        otherProps.className,
        type && `button_${type}`,
        clickable
          ? 'button_clickable'
          : (otherProps.onClick && 'button_clickable'),
      )}
    >
      <div className="button__text">{children}</div>
    </Component>
  );
})


Button.defaultProps = {
  type: 'default',
  component: 'div',
  clickable: false,
};

export default Button;
