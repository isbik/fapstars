import Lottie from 'lottie-react';
import { FC } from 'react';

import styles from './EarnPage.module.sass';

import MoneyRainDuck from '~/assets/stikers/money_rain_duck.json';
import { Subtitle } from '~/shared/ui';
import { EverydayAward } from '~/widgets/Earns/EverydayAward/EverydayAward';
import InviteFriends from '~/widgets/Earns/InviteFriends/ui/InviteFriends';

const EarnPage: FC = () => {
  return (
    <>
      <div className={styles.titleWrapper}>
        <div className={styles.titleStiker}>
          <Lottie className="mx-auto size-24" animationData={MoneyRainDuck} loop={true} />
        </div>
        <h2>Earn more FAP stars</h2>
      </div>

      <Subtitle className="mb-6">Everyday tasks</Subtitle>

      <EverydayAward />

      <InviteFriends />
    </>
  );
};

export default EarnPage;
