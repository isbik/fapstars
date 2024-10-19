import clsx from 'clsx';
import { InputHTMLAttributes, Ref, forwardRef } from 'react';

import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errors?: string[];
  label?: string;
  className?: string;
}

const Input = forwardRef(function Input(props: InputProps, ref: Ref<HTMLInputElement>) {
  const { leftIcon, rightIcon, errors, label, className, ...rest } = props;
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <input
          className={clsx([
            styles.input,
            {
              [styles.input__withLeftIcon]: !!leftIcon,
              [styles.input__withRightIcon]: !!rightIcon,
            },
            className,
          ])}
          ref={ref}
          {...rest}
        />
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {errors?.map((error, index) => (
        <span key={index} className={styles.error}>
          {error}
        </span>
      ))}
    </div>
  );
});

export default Input;
