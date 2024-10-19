import { cn } from '~/shared/utils/cn';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  className?: string;
  height?: number;
  width?: number;
  variant?: 'circle' | 'rect';
};

const Skeleton = ({ className, variant = 'rect', ...props }: Props) => {
  const radius = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div
      {...props}
      style={{ height: props.height, width: props.width, ...props }}
      className={cn(radius, 'from-transparent to-transparent bg-[#2A2B30] animate-pulse', className)}
    ></div>
  );
};

export { Skeleton };
