import { FC } from 'react';

import EditIcon from '../../Icons/EditIcon';

interface AvatarEditProps {
  onClick: () => void;
}

const AvatarEdit: FC<AvatarEditProps> = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <EditIcon />
    </div>
  );
};

export default AvatarEdit;
