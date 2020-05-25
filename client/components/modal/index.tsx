import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

import './styles.scss';
import TimesSVG from './svg/times.svg';


interface ModalProps {
  show: boolean;
  onClose: () => void;
  container?: Element | null;
}

const useContainer = (_container?: Element | null) => {
  const [container, setContainer] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const container = document.querySelector('.app__modals');

    if (typeof _container === 'undefined') {
      setContainer(container);
    } else if (_container !== null) {
      setContainer(_container);
    }

  }, [_container]);

  return container;
};

const useKeyboard = (onClose: () => void) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
};

function Modal(props: ModalProps & React.HTMLAttributes<HTMLElement>) {
  const { className, children, show, onClose, container, ...otherProps } = props;
  const _container = useContainer(container);
  useKeyboard(onClose);

  const handleButtonCloseClick = () => onClose();

  const modal = (
    <CSSTransition
      in={show}
      timeout={400}
      classNames="modal_transition"
      unmountOnExit
      mountOnEnter
    >
      <div {...otherProps} className={cx('modal', className)}>
        <div className="modal__inner">
          <div className="modal__bg"></div>
          <div className="modal__body">
            <div className="modal__body-container">{children}</div>
          </div>
          <div className="modal__button-close" onClick={handleButtonCloseClick}>
            <TimesSVG />
          </div>
        </div>
      </div>
    </CSSTransition>
  );

  return _container ? (
    ReactDOM.createPortal(modal, _container)
  ) : modal;
}


export default Modal;
