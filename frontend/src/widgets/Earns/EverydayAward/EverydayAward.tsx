import dayjs from 'dayjs';
import { useState } from 'react';

import useAuth from '~/app/context/auth/useAuth';
import { dailyRewardApi } from '~/entities/rewards/api/dailyReward';
import { useConfigs } from '~/entities/user/hooks/useConfigs';
import { CheckIcon } from '~/shared/icons/check-icon';
import { ChevronRightIcon } from '~/shared/icons/chevron-right';
import { Button, Drawer, InfoBlock } from '~/shared/ui';
import { Star } from '~/shared/ui/Star/Star';
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber';
import { cn } from '~/shared/utils/cn';

const EverydayAward = () => {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const { configs } = useConfigs();

  const totalRewards = Object.keys(configs?.dailyRewards || {}).length;

  const steak = Math.min(
    dayjs().diff(user?.dailyAwardClaimedAt, 'hours') >= 24 ? 0 : user?.dailyAwardSteak || 0,
    totalRewards,
  );

  const handleClaimAward = () => {
    dailyRewardApi()
      .then(data => {
        setUser({ ...user, ...data });
      })
      .then(() => {
        setOpen(false);
      });
  };

  const isClaimed = dayjs(user?.dailyAwardClaimedAt).isSame(dayjs(), 'day') && user?.dailyAwardSteak !== 0;

  return (
    <>
      <InfoBlock
        className="flex-row items-center gap-4 px-4 mb-10"
        onClick={() => {
          setOpen(true);
        }}
      >
        <img className="size-12" src="/assets/tg_stars.webp" alt="" />

        <div className="flex flex-col gap-1 mr-auto">
          <p className="text-lg">Everyday award</p>

          <div className="flex gap-2">
            <Star />
            <span className="text-[#a51195]">
              +{abbreviateNumber(configs?.dailyRewards[Math.min(steak + 1, totalRewards)] ?? 500)}
            </span>
          </div>
        </div>
        {isClaimed ? <CheckIcon /> : <ChevronRightIcon />}
      </InfoBlock>

      <Drawer className="flex flex-col items-center" isVisible={open} onClose={() => setOpen(false)} withCross>
        <img className="my-8 size-28" src="/assets/tg_stars.webp" alt="" />

        <h3 className="mb-2">Everyday award</h3>
        <p className="mb-6 text-center">more stars per one day</p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] w-full gap-4 mb-10">
          {Array.from({ length: totalRewards }).map((_, index) => {
            const active = Math.min(steak, totalRewards - 1) === index;
            const day = index + 1;

            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col items-center bg-[#212226] p-2 rounded-lg',
                  active &&
                    'border-solid border-[1.5px] border-[#A51295] shadow-[0px_0px_15px_0px_rgba(165,17,149,0.65)]',
                  steak < index && 'opacity-60',
                  active && isClaimed && 'bg-[#A51295]',
                )}
              >
                <p className="mb-2 text-lg">Day {day}</p>
                <Star className="mb-2" />
                <span>{abbreviateNumber(configs?.dailyRewards[day])}</span>
              </div>
            );
          })}
        </div>

        {isClaimed ? (
          <Button variant="outline" onClick={() => setOpen(false)}>
            Come back tomorrow
          </Button>
        ) : (
          <Button onClick={handleClaimAward}>Receive</Button>
        )}
      </Drawer>
    </>
  );
};

export { EverydayAward };
