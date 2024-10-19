import React, { useRef, useState } from 'react';

import Button from '../Buttons/Button/Button';

import styles from './ExpandAvatar.module.scss';

const ExpandAvatar = (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
  const avatarRef = useRef<HTMLImageElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [imageProps, setImageProps] = useState<{
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    src?: string;
  }>({});
  const [isAnimation, setIsAnimation] = useState(false);

  const handleClick = () => {
    const avatar = avatarRef.current;

    if (!avatar) return;

    if (!isOpen) {
      const { top, left, width, height } = avatar.getBoundingClientRect();

      setImageProps({
        top,
        left,
        width,
        height,
        src: avatar.src,
      });

      window.setTimeout(() => {
        setIsOpen(true);
        setIsAnimation(true);
      }, 10);

      window.setTimeout(() => {
        setIsAnimation(false);
      }, 500);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <img
        ref={avatarRef}
        {...props}
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          visibility: isAnimation || isOpen ? 'hidden' : 'visible',
          objectFit: 'cover',
        }}
      />

      <div
        className={`${styles.fullscreen} ${isOpen ? styles.open : ''}`}
        style={{
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <img
          src={imageProps.src}
          className={`${styles.fullscreenImage} ${isOpen ? styles.expanding : styles.closing}`}
          style={{
            position: 'absolute',
            top: isOpen ? '0' : `${imageProps.top}px`,
            left: isOpen ? '0' : `${imageProps.left}px`,
            width: isOpen ? '100vw' : `${imageProps.width}px`,
            height: isOpen ? '100%' : `${imageProps.height}px`,
            objectFit: 'contain',
            transition: 'top 0.5s ease, left 0.5s ease, width 0.5s ease, height 0.5s ease, border-radius 0.5s ease',
            borderRadius: isOpen ? '0' : '50%',
            visibility: isOpen || isAnimation ? 'visible' : 'hidden',
          }}
        />
        {isOpen && (
          <Button
            variant="outline"
            className={styles.closeButton}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(false);

              setIsAnimation(true);

              window.setTimeout(() => {
                setIsAnimation(false);
              }, 500);
            }}
          >
            &#9587;
          </Button>
        )}
      </div>
    </div>
  );
};

export { ExpandAvatar };
