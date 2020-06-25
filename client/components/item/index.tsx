import React from 'react';
import cx from 'classnames';

import './styles.scss';


type ItemProps = {
  image: JSX.Element | { initials: string; color: 'green' | 'orange' | 'red' };
  first: JSX.Element | string;
  second: JSX.Element | string;
  hoverable?: boolean;
}

const getDefaultImage = (initials: string, color: 'green' | 'orange' | 'red') => (
  <div className={cx('item__image', `item__image_${color}`)}>
    {initials}
  </div>
);

function Item(props: ItemProps & React.HTMLAttributes<HTMLElement>) {
  let { first, second, image, hoverable, ...otherProps } = props;

  if ('initials' in image) {
    image = getDefaultImage(image.initials, image.color);
  }

  return (
    <div {...otherProps} className={cx('item', hoverable && 'item_hoverable', otherProps.className)}>
      <div className="item__image-wrap">{image}</div>
      <div className="item__text-wrap">
        <div className="item__text-inner-wrap">
          <div className="item__text-first">{first}</div>
          <div className="item__text-second">{second}</div>
        </div>
      </div>
    </div>
  );
}

Item.defaultProps = {
  hoverable: false,
};


export default Item;
