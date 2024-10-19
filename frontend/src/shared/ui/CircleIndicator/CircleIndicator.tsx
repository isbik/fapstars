//,

import { cn } from '~/shared/utils/cn';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  percent: number;
}

const CircleIndicator = ({ percent, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn('flex items-center justify-center  size-6 rounded-full', props.className)}
      style={{
        background: `conic-gradient(transparent ${percent}%, black 0deg),  radial-gradient(closest-side, black 78%, #A51195 90% 100%)`,
      }}
    >
      <span className="text-[10px]">{Math.floor(percent)}</span>
    </div>
  );
};

export { CircleIndicator };
