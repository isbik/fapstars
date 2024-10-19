import { CSSProperties, ChangeEvent, FC } from 'react';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  name?: string;
  checked: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  css?: CSSProperties;
}

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange, css, name }) => {
  return (
    <label className={styles.checkbox_label} style={css}>
      <input type="checkbox" className={styles.checkbox_input} checked={checked} onChange={onChange} name={name} />
      <span className={styles.checkbox_custom}></span>
      {label}
    </label>
  );
};

export default Checkbox;
