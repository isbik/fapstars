import clsx from 'clsx';
import React from 'react';

import styles from './thread.module.scss';

import DislikeIcon from '~/shared/icons/dislike';
import LikeIcon from '~/shared/icons/like';

interface threadProps {
  className?: string;
  content: string;
  username?: string;
  pic?: string;
}

const Thread: React.FC<threadProps> = ({ className, pic, content, username }) => {
  // todo сделать юай компонент для лайка с каунтером

  return (
    <div className={clsx([styles.thread, className])}>
      <div className={styles.threadWrapper}>
        <div className={styles.userAndContent}>
          <img className={styles.pic} src={pic} alt="avatar" />

          <div className={styles.textWrapper}>
            <span className={styles.username}>{username} </span>
            <span className={styles.text}>{content}</span>

            <div className={styles.feedback}>
              <div className={styles.like}>
                <LikeIcon />
                <span>100</span>
              </div>
              <div className={styles.like}>
                <DislikeIcon />
                <span>9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className={styles.timeAgo}> 5 min ago</span>
    </div>
  );
};

export default Thread;
