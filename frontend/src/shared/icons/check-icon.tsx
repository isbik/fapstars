import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const CheckIcon = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none" {...props}>
      <path d="M17 1.5L6 12.5L1 7.5" stroke="#F6F6F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { CheckIcon };
