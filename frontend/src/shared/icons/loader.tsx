import { FC } from 'react';

type LoaderProps = React.SVGProps<SVGSVGElement>;

const Loader: FC<LoaderProps> = ({ ...props }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#FF69B4"
        strokeWidth="4"
        strokeDasharray="100"
        strokeLinecap="round"
        style={{
          strokeDashoffset: 0,
          transform: 'rotate(0deg)',
          transformOrigin: 'center',
          animation: 'rotate 1.5s linear infinite, dash 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes dash {
          0% {
            stroke-dashoffset: 100;
          }
          50% {
            stroke-dashoffset: 25;
            transform: rotate(135deg);
          }
          100% {
            stroke-dashoffset: 100;
            transform: rotate(450deg);
          }
        }
      `}</style>
    </svg>
  );
};

export default Loader;
