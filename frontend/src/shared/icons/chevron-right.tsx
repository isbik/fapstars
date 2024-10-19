import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ChevronRightIcon = (props: Props) => {
  return (
    <svg {...props} width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 17L9 9L1 1" stroke="#918D98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { ChevronRightIcon };
