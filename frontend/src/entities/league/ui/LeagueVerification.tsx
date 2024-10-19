import dayjs from 'dayjs';

import { isExpiredVerification } from '../lib/validation-expired';
import { League } from '../types';

import { useConfigs } from '~/entities/user/hooks/useConfigs';
import { ProgressBar } from '~/shared/ui';
import { CircleIndicator } from '~/shared/ui/CircleIndicator/CircleIndicator';
import { Star } from '~/shared/ui/Star/Star';

type Props = {
  league?: League | null;
};

const LeagueVerification = ({ league }: Props) => {
  const { configs } = useConfigs();

  if (isExpiredVerification({ league }) || !league) return;

  const percent = Math.floor((Number(league.balance) / (configs?.coinsToVerifyLeague ?? 0)) * 100);

  const time = dayjs(league.needVerifiedAt).diff(new Date(), 'hours');

  const hours = String(time % 24).padStart(2, '0');

  const days = Math.floor(time / 24);

  return (
    <div className="mb-10">
      <p className="mb-2 text-lg">Remaining for league validation</p>

      <div className="flex items-center mb-2">
        <Star className="mr-1" />
        <span className="font-medium">{league.balance} &nbsp;</span> / {configs?.coinsToVerifyLeague}
        <span className="ml-auto mr-2">
          {days ? `${days}d ` : ''}
          {hours?.replace(/^0(?=\d)/, '')}h
        </span>
        <CircleIndicator percent={percent} />
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
};

export { LeagueVerification };
