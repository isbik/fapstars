import { FC } from 'react';
import { Link } from 'react-router-dom';

import { isExpiredVerification } from '../lib/validation-expired';
import { League } from '../types';

import { CheckVerified } from './CheckVerified';

import LeagueIcon from '~/assets/league_icon.png';
import { useConfigs } from '~/entities/user/hooks/useConfigs';
import { ListItem } from '~/shared/ui';
import { CircleIndicator } from '~/shared/ui/CircleIndicator/CircleIndicator';
import { RightArrowIcon } from '~/shared/ui/Icons';
import { Star } from '~/shared/ui/Star/Star';
import { formatNumber } from '~/shared/utils/formatNumber';

interface LeagueListItemProps {
  league: League;
}

const LeagueListItem: FC<LeagueListItemProps> = ({ league }) => {
  const { id, avatar, name, balance, isVerified } = league;
  const { configs } = useConfigs();

  const isExpired = isExpiredVerification({ league });

  const percent = (Number(league.balance) / (configs?.coinsToVerifyLeague ?? 0)) * 100;

  return (
    <Link to={`/leagues/${id}`}>
      <ListItem
        picture={avatar ?? LeagueIcon}
        title={
          <>
            {name}
            {isVerified && <CheckVerified />}
          </>
        }
        content={
          <>
            <Star />
            {formatNumber(balance)}
          </>
        }
        right={
          isExpired || league.isVerified ? <RightArrowIcon /> : <CircleIndicator className="size-8" percent={percent} />
        }
      />
    </Link>
  );
};

export default LeagueListItem;
