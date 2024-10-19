import { FC, PropsWithChildren } from 'react';

import { cn } from '~/shared/utils/cn';

interface SubtitleProps extends PropsWithChildren {
  className?: string;
}

const Subtitle: FC<SubtitleProps> = ({ children, className }) => {
  return <h2 className={cn(['m-0 text-lg', className])}>{children}</h2>;
};

export default Subtitle;
