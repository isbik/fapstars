import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const CloseIcon = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 9L9 1M1 1L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { CloseIcon };
