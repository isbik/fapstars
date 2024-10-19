import styles from './ProgressBar.module.sass';

import { cn } from '~/shared/utils/cn';
interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  percent: number;
}

const ProgressBar = ({ percent, ...props }: Props) => {
  return (
    <div {...props} className={cn(styles.staminaBar, props.className)}>
      <div className={styles.staminaProgress} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

export { ProgressBar };
