import { cn } from '../utils/cn';

type Props = React.SVGProps<SVGSVGElement>;

const Spinner = (props: Props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn('animate-spin text-[#A51195]', props.className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40ZM20 36.6667C29.2047 36.6667 36.6667 29.2047 36.6667 20C36.6667 10.7953 29.2047 3.33333 20 3.33333C10.7953 3.33333 3.33333 10.7953 3.33333 20C3.33333 29.2047 10.7953 36.6667 20 36.6667Z"
        fill="url(#paint0_angular_2046_3444)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.9692 16.0012C38.8821 15.8834 39.7177 16.528 39.8354 17.4409C39.9449 18.2895 39.9998 19.1443 39.9998 20C39.9998 20.9205 39.2537 21.6667 38.3332 21.6667C37.4127 21.6667 36.6665 20.9205 36.6665 20C36.6665 19.287 36.6208 18.5746 36.5295 17.8674C36.4117 16.9545 37.0563 16.119 37.9692 16.0012Z"
        fill="currentColor"
      />
      <defs>
        <radialGradient
          id="paint0_angular_2046_3444"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 20) scale(20)"
        >
          <stop stopColor="" stopOpacity="0" />
          <stop offset="0.0001" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export { Spinner };
