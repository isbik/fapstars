import { FC } from 'react';

import IconProps from './IconProps';

const ExitIcon: FC<IconProps> = ({ size }) => {
  return (
    <svg width={size || 19} height={size || 19} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 1.5L4.5 1.5C2.84315 1.5 1.5 2.84315 1.5 4.5L1.5 14.5C1.5 16.1569 2.84315 17.5 4.5 17.5H5.5M13.5 13.5L17.5 9.5M17.5 9.5L13.5 5.5M17.5 9.5L5.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExitIcon;
