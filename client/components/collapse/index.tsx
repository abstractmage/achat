import React from 'react';
import { Transition } from 'react-transition-group';

interface CollapseProps {
  children: React.ReactNode;
}

function Collapse(props: CollapseProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) setHeight(ref.current.offsetHeight);
  }, [ref]);

  console.log(height);

  return (
    <Transition timeout={0}>
      {
        state => (
          <div
            ref={ref}
            className="collapse"
            // style={{ height: state === 'entering' ? height : 0 }}
          >
            {props.children}
          </div>
        )
      }
    </Transition>
  );
}

export default Collapse;
