import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

import EditIcon from '../../Icons/EditIcon';

import styles from './AvatarEdit.module.sass';

interface AvatarEditProps extends HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  className?: string;
}

const AvatarEdit: FC<AvatarEditProps> = ({ onClick, className, ...props }) => {
  return (
    <div onClick={onClick} className={clsx([styles.avatarEdit, className])} {...props}>
      <EditIcon />
    </div>
  );
};

export default AvatarEdit;
