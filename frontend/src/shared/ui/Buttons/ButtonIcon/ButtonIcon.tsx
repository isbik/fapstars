import clsx from 'clsx';
import { CSSProperties, FC, ReactNode, SyntheticEvent } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './ButtonIcon.module.sass';

interface ButtonIconProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
  link?: string;
}

const ButtonIcon: FC<ButtonIconProps> = ({ children, className, onClick, link, ...props }) => {
  return (
    <>
      {link ? (
        <NavLink to={link} className={clsx([styles.btn, className])} {...props}>
          {children}
        </NavLink>
      ) : (
        <button onClick={onClick} className={clsx([styles.btn, className])} {...props}>
          {children}
        </button>
      )}
    </>
  );
};

export default ButtonIcon;
