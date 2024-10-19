import React, { ReactNode, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './BottomSheet.module.scss';
import { CloseIcon } from '~/shared/icons/close';

export interface BottomSheetProps {
  className?: string;
  children: ReactNode;
  isOpened: boolean;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ className, onClose, children, isOpened }) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [deltaY, setDeltaY] = useState(0);
  const [isOpenedBefore, setIsOpenedBefore] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const overlay = overlayRef.current;
      if (!overlay) return;

      overlay.style.transition = 'transform 0.3s ease-out';
      overlay.style.transform = 'translateY(100%)';

      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Determining the initial y-axis coordinate
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!startY) {
      return;
    }
    const currentY = e.touches[0].clientY; // Current y-axis coordinate
    const newDeltaY = currentY - startY; // Difference of current and start y

    if (overlayRef.current) {
      const { height } = overlayRef.current.getBoundingClientRect();
      const minDeltaY = 0;

      if (newDeltaY > minDeltaY && newDeltaY < height) {
        /* e.preventDefault(); // Остановка прокрутки страницы */
        setDeltaY(newDeltaY);
        overlayRef.current.style.transform = `translateY(${newDeltaY}px)`; // moving the div by y-axis
      }
    }
  };

  const handleTouchEnd = () => {
    if (!overlayRef.current || !startY) {
      return;
    }

    const overlay = overlayRef.current;
    const { height } = overlay.getBoundingClientRect();
    const minDeltaY = height / 2;

    // we should close the modal if we see more than half the height of the div on the screen
    if (deltaY > minDeltaY) {
      overlay.style.transition = 'transform 0.3s ease-out';
      overlay.style.transform = `translateY(${height}px)`;
      onClose();
    } else {
      // if user didn't move the div to its half-height, div will not disappear
      overlay.style.transition = 'transform 0.3s ease-out';
      overlay.style.transform = 'translateY(0)';
    }

    setStartY(null);
    setDeltaY(0); // Reset deltaY value
  };

  useEffect(() => {
    if (isOpened && isOpenedBefore) {
      if (overlayRef.current) {
        overlayRef.current.style.transform = 'translateY(0)';
      }
    }
    if (!isOpened) {
      if (overlayRef.current) {
        overlayRef.current.style.transform = 'translateY(100%)';
      }
    }
    setIsOpenedBefore(isOpened);
  }, [isOpened, isOpenedBefore]);

  return (
    <div className={clsx(styles['bottom-sheet'], isOpened && styles['bottom-sheet-visible'])}>
      <div className={styles['bottom-sheet-overlay']} onClick={handleClick}>
        <div
          ref={overlayRef}
          className={clsx(styles['bottom-sheet-overlay-content'], className)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.x} onClick={onClose}>
            <CloseIcon />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
