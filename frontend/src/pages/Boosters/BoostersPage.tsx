import Lottie from 'lottie-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './BoosterPage.module.scss';

import useAuth from '~/app/context/auth/useAuth';
import ConfettiDuckAnimation from '~/assets/stikers/confetti.json';
import { buyFullEnergyBoosterApi } from '~/entities/boosters/api/buyFullEnergyBooster';
import { buyTurboBoosterApi } from '~/entities/boosters/api/buyTurboBooster';
import { updateEnergyLimitLevelApi } from '~/entities/boosters/api/updateEnergyLimit';
import { updateMultitapBoosterApi } from '~/entities/boosters/api/updateMultitapBooster';
import { getBoosterPriceByLevel } from '~/entities/boosters/lib/getBoosterPriceByLevel';
import { BoosterLabel } from '~/entities/boosters/ui/BoosterLabel';
import { User } from '~/entities/user/types';
import { ArrowRightIcon } from '~/shared/icons/arrow-right';
import { Button, Drawer, InfoBlock, Subtitle } from '~/shared/ui';
import { Star } from '~/shared/ui/Star/Star';
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber';

type BoosterConfig = {
  title: string;
  description: React.ReactNode;
  price: (user: User) => string | number;
  action: () => Promise<Partial<User>>;
  property: keyof User;
  image: string;
};

const boostersConfig: BoosterConfig[] = [
  {
    title: 'Full energy',
    description: 'restore your energy for a new round',
    price: () => 'Free',
    property: 'fullEnergyBoosterAt',
    action: () => buyFullEnergyBoosterApi(),
    image: '/assets/boost_circle.webp',
  },
  {
    title: 'Turbo',
    description: 'tap and mine FAP coins as much as you can',
    price: () => 'Free',
    property: 'fullTurboBoosterAt',
    action: () => buyTurboBoosterApi(),
    image: '/assets/boost.webp',
  },
  {
    title: 'Multitap',
    description: (
      <>
        more FAP coins per one tap
        <br />
        +1 FAP coin per tap
      </>
    ),
    price: (user: User) => getBoosterPriceByLevel(user.multitapLevel),
    action: () => updateMultitapBoosterApi(),
    property: 'multitapLevel',
    image: '/assets/x2.webp',
  },
  {
    title: 'Energy limit',
    description: (
      <>
        more energy per one round
        <br />
        +500 energy per round
      </>
    ),
    price: (user: User) => getBoosterPriceByLevel(user.energyLimitLevel),
    action: () => updateEnergyLimitLevelApi(),
    property: 'energyLimitLevel',
    image: '/assets/speed_full.webp',
  },
];

const BoostersPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [busterForBuy, setBusterForBuy] = useState<(typeof boostersConfig)[number] | null>(null);

  const [playAnimation, setPlayAnimation] = useState<boolean>(false);

  if (!user) return null;

  const getDrawerPrice = () => {
    if (!busterForBuy) return null;

    const price = busterForBuy.price(user);

    return typeof price === 'number' ? abbreviateNumber(price) : price;
  };

  return (
    <>
      <div className={styles['titleWrapper']}>
        <h2>Boosters</h2>
      </div>

      <section className={styles['section']}>
        <Subtitle className={styles['label']}>Free everyday boosters</Subtitle>

        {boostersConfig.slice(0, 2).map(config => (
          <InfoBlock key={config.property} className={styles['block']} onClick={() => setBusterForBuy(config)}>
            <img className="size-10" src={config.image} alt={config.title} />
            <div className={styles['content']}>
              <p>{config.title}</p>
              <BoosterLabel fullAt={String(user[config.property])} />
            </div>
          </InfoBlock>
        ))}
      </section>

      <section className={styles['section']}>
        <Subtitle className={styles['label']}>Boosters</Subtitle>

        {boostersConfig.slice(2).map(config => {
          const level = String(user[config.property]);

          return (
            <InfoBlock key={config.property} className={styles['block']} onClick={() => setBusterForBuy(config)}>
              <img className="size-10" src={config.image} alt={config.title} />
              <div className={styles['content']}>
                <p>{config.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star />
                  <p>
                    {abbreviateNumber(config.price?.(user))} · {level} level
                  </p>
                </div>
              </div>
              <ArrowRightIcon />
            </InfoBlock>
          );
        })}
      </section>

      <Drawer
        className="flex flex-col items-center"
        isVisible={Boolean(busterForBuy)}
        withCross
        onClose={() => setBusterForBuy(null)}
      >
        {busterForBuy && <img className="size-32 mb-8" src={busterForBuy.image} alt={busterForBuy.title} />}

        <h3 className="mb-2">{busterForBuy?.title}</h3>
        <p className="mb-6 text-center text-xl">{busterForBuy?.description}</p>
        <div className="flex items-center gap-2 mb-10 text-xl font-semibold">
          <Star />
          {getDrawerPrice()}
        </div>

        <div className="relative w-full">
          {playAnimation && (
            <Lottie
              className="h-48 fixed -bottom-12 left-0 right-0"
              animationData={ConfettiDuckAnimation}
              loop={true}
            />
          )}

          <Button
            onClick={() => {
              busterForBuy?.action().then(data => {
                setUser({ ...user, ...data });
                setPlayAnimation(true);

                setTimeout(() => {
                  setPlayAnimation(false);
                  // Redirect to mine page
                  if (['fullEnergyBoosterAt', 'fullTurboBoosterAt'].includes(busterForBuy.property)) {
                    return navigate('/mine');
                  }

                  return setBusterForBuy(null);
                }, 1000);
              });
            }}
            className="w-full"
          >
            Receive
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export { BoostersPage };
