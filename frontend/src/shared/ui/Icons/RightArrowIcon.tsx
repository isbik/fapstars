import { FC } from 'react';

import IconProps from './IconProps';

const RightArrowIcon: FC<IconProps> = ({ size }) => {
  return (
    <svg width={size || 22} height={size || 20} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.6667 1.66666L21 9.99999M21 9.99999L12.6667 18.3333M21 9.99999L1 9.99999"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RightArrowIcon;
