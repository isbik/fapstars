import { CheckIcon } from '~/shared/icons/check-icon';
import { cn } from '~/shared/utils/cn';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const CheckVerified = (props: Props) => {
  return (
    <span
      {...props}
      className={cn('flex items-center justify-center w-4 h-4 ml-1 rounded-full', props.className)}
      style={{
        background: 'linear-gradient(180deg, #A51295 0%, #4C0158 100%)',
      }}
    >
      <CheckIcon className="size-2.5" />
    </span>
  );
};

export { CheckVerified };
