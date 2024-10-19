import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './UserPage.module.sass';

import useAuth from '~/app/context/auth/useAuth';
import { getUserReferrals } from '~/entities/user/api';
import { ReferralsResponse, User } from '~/entities/user/types';
import { ArrowRightIcon } from '~/shared/icons/arrow-right';
import { TelegramIcon } from '~/shared/icons/telegram';
import { InfoBlock, ListItem } from '~/shared/ui';
import { ExpandAvatar } from '~/shared/ui/ExpandAvatar';
import { RightArrowIcon } from '~/shared/ui/Icons';
import { Star } from '~/shared/ui/Star/Star';
import { cn } from '~/shared/utils/cn';
import { formatNumber } from '~/shared/utils/formatNumber';

type UserPageProps = {
  user?: User;
};

const UserPageInfo = ({ user }: UserPageProps) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<ReferralsResponse | null>(null);

  useEffect(() => {
    user &&
      getUserReferrals(user?.id, 100).then(({ data }) => {
        setReferrals(data);
      });
  }, [user]);

  const isCurrentUser = user?.id === authUser?.id;

  return (
    <>
      {user?.avatar && (
        <div className={styles.photoContainer}>
          <ExpandAvatar src={user.avatar} className={styles.photo} />
        </div>
      )}

      <h1 className={styles.username}>@{user?.username}</h1>

      <div className={styles.info}>
        <InfoBlock className={cn(styles.balanceWrapper)}>
          <span>Balance</span>
          <div className={styles.balanceData}>
            <Star />
            <span>{formatNumber(user?.balance)}</span>
          </div>
        </InfoBlock>

        <InfoBlock
          className="justify-between flex-row items-center"
          component={NavLink}
          to={`/users/${user?.id}/invited_models`}
        >
          <div className="flex flex-col gap-2">
            <span className={styles.title}>Invited models</span>
            <span className={styles.count}>{referrals?.modelsCount || 0}</span>
          </div>
          <ArrowRightIcon />
        </InfoBlock>

        {user?.league && (
          <div className={styles.myLeague}>
            <ListItem
              title={'League'}
              content={user?.league?.name}
              picture={user?.league?.avatar ?? undefined}
              right={<RightArrowIcon />}
              onClick={() => navigate(`/leagues/${user?.leagueId}`)}
            />
          </div>
        )}
      </div>

      {user?.username && !isCurrentUser && (
        <InfoBlock
          onClick={() => window.Telegram.WebApp.openTelegramLink(`https://t.me/${user?.username}`)}
          className={styles.telegramProfile}
        >
          <TelegramIcon />
          Telegram Profile
        </InfoBlock>
      )}

      <div className={styles.referals}>
        <div className={styles.referralsInfo}>
          <div className={styles.referralsInfo_title}>
            <h2>{isCurrentUser ? 'Your referrals' : 'Referrals'}</h2>
            <span className={styles.referralsInfo_count}>({referrals?.count})</span>
          </div>
          <div className={styles.referralsInfo_balance}>
            <Star /> {referrals?.totalBalance}
          </div>
        </div>

        <div className={styles.referralsList} style={{ flexGrow: 0 }}>
          {referrals?.referrals?.map(referral => (
            <ListItem
              key={referral.id}
              title={referral.username}
              onClick={() => navigate(`/users/${referral.id}`)}
              content={
                <>
                  <Star /> {formatNumber(referral.balance)}
                </>
              }
            />
          ))}
        </div>

        {/* TODO: */}
        {/* <div>
					<Link to={"/referrals/list"}>See all</Link>
				</div> */}
      </div>
    </>
  );
};

export { UserPageInfo };
