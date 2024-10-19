import { QRCodeSVG } from 'qrcode.react';
import { FC, useState } from 'react';

import { generateReferalLink as generateReferralLink } from '../utils';

import styles from './InviteFriends.module.sass';

import useAuth from '~/app/context/auth/useAuth';
import InviteTaskStiker from '~/assets/stikers/calling_duck.json';
import PremiumInviteTaskStiker from '~/assets/stikers/premium_sim_duck.json';
import { useCopied } from '~/shared/hooks/useCopied';
import { Button, Drawer, Input, ListItem, Subtitle } from '~/shared/ui';
import { Star } from '~/shared/ui/Star/Star';
import { formatNumber } from '~/shared/utils/formatNumber';

const InviteFriends: FC = () => {
  const INVITE_SIMPLE_USER_AWARD = formatNumber(2000);
  const INVITE_PREMIUM_USER_AWARD = formatNumber(5000);

  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  // const referralLink = user?.tgId && generateReferralLink(user?.tgId);
  // TODO use user_id, need fix bot message, not user
  const referralLink = generateReferralLink(user?.username ?? '');

  const handleClick = () => {
    setIsVisible(true);
  };

  const { isCopied, copy } = useCopied();

  return (
    <div>
      <Subtitle>Invite your friends</Subtitle>

      <div className={styles.taskList}>
        <ListItem
          onClick={handleClick}
          title={'Invite friend'}
          sticker={InviteTaskStiker}
          content={
            <>
              <Star />
              <span className={styles.bonus}>+{INVITE_SIMPLE_USER_AWARD}</span>
              <span className={styles.subtext}>for you</span>
            </>
          }
        />
        <ListItem
          onClick={handleClick}
          title={'Invite friend with Telegram Premium'}
          sticker={PremiumInviteTaskStiker}
          content={
            <>
              <Star />
              <span className={styles.bonus}>+{INVITE_PREMIUM_USER_AWARD}</span>
              <span className={styles.subtext}>for you</span>
            </>
          }
        />
      </div>

      <Drawer isVisible={isVisible} onClose={() => setIsVisible(false)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <h3>Your referral link</h3>
          <Input value={referralLink} onChange={e => e.preventDefault} className={styles.refInput} disabled={true} />

          <div className="flex items-center justify-center w-full mx-auto my-2">
            <QRCodeSVG
              marginSize={2}
              className="mx-auto rounded-lg"
              value={referralLink}
              fgColor="#fff"
              bgColor="transparent"
            />
          </div>
          <Button onClick={() => copy(referralLink ?? '')}>{isCopied ? 'Copied!' : 'Copy'}</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default InviteFriends;
