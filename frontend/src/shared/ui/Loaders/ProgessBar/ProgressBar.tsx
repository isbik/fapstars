import { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './ProgressBar.module.sass';

const animations = {
  enter: styles.progressEnter,
  enterActive: styles.progressEnterActive,
  exit: styles.progressExit,
  exitActive: styles.progressExitActive,
};

interface ProgressBarProps {
  color?: string;
  border?: string;
}

const LoaderProgressBar: FC<ProgressBarProps> = ({ color = 'white', border }) => {
  const [progress, setProgress] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <CSSTransition in={progress > 0} timeout={300} classNames={animations} unmountOnExit nodeRef={nodeRef}>
      <div
        className={styles.progressBarContainer}
        style={{
          borderWidth: border ? 2 : 0,
          borderColor: border,
          borderStyle: 'solid',
        }}
      >
        <div
          className={styles.progressBar}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
          ref={nodeRef}
        ></div>
      </div>
    </CSSTransition>
  );
};

export default LoaderProgressBar;
