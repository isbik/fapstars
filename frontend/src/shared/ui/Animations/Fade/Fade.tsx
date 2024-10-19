import clsx from 'clsx';
import React, { useState, useEffect, FC } from 'react';

import styles from './Fade.module.sass';

interface FadeProps {
  duration: number;
  children: React.ReactNode;
}

const Fade: FC<FadeProps> = ({ duration, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={clsx(styles.fade, { [styles.visible]: isVisible })} style={{ transitionDuration: `${duration}ms` }}>
      {children}
    </div>
  );
};

export default Fade;
