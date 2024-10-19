import Lottie from 'lottie-react';
import { FC, ReactNode } from 'react';

import styles from './ListItem.module.sass';

import { cn } from '~/shared/utils/cn';

type ListItemProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'content' | 'title'
> & {
  title: ReactNode;
  content: ReactNode;
  picture?: string;
  sticker?: object;
  right?: ReactNode;
};

const ListItem: FC<ListItemProps> = ({ picture, title, content, right, sticker, ...props }) => {
  return (
    <div {...props} className={cn(styles.listItem, props.className)}>
      {picture && (
        <div className={styles.avatar}>
          <img src={picture} alt="picture" />
        </div>
      )}

      {sticker && (
        <div className={styles.sticker}>
          <Lottie animationData={sticker} loop={true} />
        </div>
      )}

      <div className={styles.main}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>

      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};

export default ListItem;
