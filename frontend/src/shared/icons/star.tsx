import { FC } from 'react';

type StarIconProps = React.SVGProps<SVGSVGElement>;

const StarIcon: FC<StarIconProps> = ({}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="17" height="22">
      <path
        fill="url(#grad1)"
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(255,255,0)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(255,165,0)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default StarIcon;
