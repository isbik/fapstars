import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Portal } from '..';

import styles from './Drawer.module.sass';

import { CloseIcon } from '~/shared/icons/close';
import { useMount } from '~/shared/models';

interface DrawerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isVisible: boolean;
  className?: string;
  withCross?: boolean;
  onClose: () => void;
}

const ANIMATION_TIME = 400;

const animations = {
  enter: styles.enter,
  enterActive: styles.enterActive,
  exit: styles.exit,
  exitActive: styles.exitActive,
};

const Drawer: FC<DrawerProps> = props => {
  const { mounted } = useMount({
    opened: props.isVisible,
    time: ANIMATION_TIME,
  });

  if (!mounted) return null;

  return (
    <Portal>
      <DrawerInner {...props}>{props.children}</DrawerInner>
    </Portal>
  );
};

interface DrawerInnerProps extends DrawerProps {}

const DrawerInner: FC<DrawerInnerProps> = ({
  children,
  isVisible,
  onClose,
  className,
  withCross = false,
  ...props
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  const [animationIn, setAnimationIn] = useState(false);
  useEffect(() => {
    setAnimationIn(true);
  }, [isVisible]);

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>

      <CSSTransition
        nodeRef={drawerRef}
        timeout={ANIMATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={animations}
        in={animationIn && isVisible}
      >
        <div {...props} className={styles.position} ref={drawerRef}>
          <div
            className={clsx([
              styles.drawer,
              className,
              {
                [styles.drawer__withCross]: withCross,
              },
            ])}
          >
            {withCross && (
              <button className={clsx(styles.cross, 'text-[8px] text-[#0B010D]')} onClick={() => onClose()}>
                <CloseIcon />
              </button>
            )}

            {children}
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Drawer;
