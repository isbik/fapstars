import clsx from 'clsx';
import { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.sass';

interface ButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  link?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'alt' | 'danger' | 'outline' | 'default';
  css?: CSSProperties;
  className?: string;
  disabled?: boolean;
  replace?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
}

const Button: FC<ButtonProps> = ({
  children,
  icon,
  css,
  className,
  disabled,
  variant = 'primary',
  link,
  replace,
  state,
  ...props
}) => {
  const btnClass = clsx([styles.button, className], {
    [styles.button_primary]: variant == 'primary',
    [styles.button_alter]: variant == 'alt',
    [styles.button_outline]: variant == 'outline',
    [styles.button_danger]: variant == 'danger',
  });

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) {
      return;
    }

    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

    props.onClick?.(event);
  };

  return (
    <>
      {link ? (
        <Link
          to={link}
          className={btnClass}
          style={css}
          onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
          replace={replace}
          state={state}
        >
          {children}
        </Link>
      ) : (
        <button onClick={onClick} className={btnClass} style={css} disabled={disabled} {...props}>
          {icon}
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
