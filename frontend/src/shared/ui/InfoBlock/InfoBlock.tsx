import { FC } from 'react';

import { cn } from '~/shared/utils/cn';

interface InfoBlock extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  component?: React.ElementType;
  className?: string;
  to?: string;
}

const InfoBlock: FC<InfoBlock> = ({ component, className, ...props }) => {
  const Component = component || 'div';

  return <Component {...props} className={cn('flex flex-col rounded-lg bg-[#191a1d] p-2 px-4 gap-2', className)} />;
};

export default InfoBlock;
