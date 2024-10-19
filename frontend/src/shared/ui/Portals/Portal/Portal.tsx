import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps extends PropsWithChildren {}

const Portal: FC<PortalProps> = ({ children }) => {
  const [node] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, [node]);

  return createPortal(children, node);
};

export default Portal;
