import { useState, useEffect } from 'react';

import styles from './Sparkle.module.scss';
type Props = {
  position: { x: number; y: number };
  cost: number;
};

const Sparkle = (props: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
      }}
      className={styles.sparkle}
    >
      ⭐️{props.cost > 1 && <span>+{props.cost}</span>}
    </div>
  );
};

export { Sparkle };
