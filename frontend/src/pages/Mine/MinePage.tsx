import dayjs from 'dayjs';
import Lottie from 'lottie-react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './MinePage.module.sass';

import useAuth from '~/app/context/auth/useAuth';
import LeagueIcon from '~/assets/league_icon.png';
import TaperAnimation from '~/assets/stikers/madeline_shake.json';
import UserIcon from '~/assets/user.png';
import { createTransaction } from '~/entities/mine/api';
import { setBalanceToLocalStorage } from '~/entities/mine/utils';
import { syncUser } from '~/entities/user/api/syncUser';
import { useUserBalance } from '~/entities/user/hooks/useUserBalance';
import { User } from '~/entities/user/types';
import { useInterval } from '~/shared/hooks/useInterval';
import { ProgressBar } from '~/shared/ui';
import { Sparkle } from '~/shared/ui/Sparkle/Sparkle';
import { Star } from '~/shared/ui/Star/Star';
import { debounce } from '~/shared/utils';
import { formatNumber } from '~/shared/utils/formatNumber';

const MinePage: FC = () => {
  const { user, setUser } = useAuth();

  const balance = useUserBalance();

  const [clickCnt, setClickCnt] = useState(0);
  const balancedCntRef = useRef(0);

  // Min 1500
  const maxStamina = (user?.energyLimitLevel ?? 1) * 500 + 1000;

  const [staminaCount, setStaminaCount] = useState(
    Math.min(maxStamina, dayjs().diff(dayjs(user?.staminaSpendAt), 'seconds')),
  );

  const staminaCountRef = useRef(staminaCount);

  useEffect(() => {
    staminaCountRef.current = staminaCount;
  }, [staminaCount]);

  const [spawns, setSpawns] = useState<{ x: number; y: number }[]>([]);

  const spendStamina = useRef(0);

  const handleSyncUser = () => {
    if (!spendStamina.current || !user) return;

    syncUser({ staminaCount: staminaCountRef.current, staminaSpend: spendStamina.current }).then(data => {
      setUser({ ...user, ...data });
    });

    spendStamina.current = 0;
  };

  useInterval(() => {
    handleSyncUser();
  }, 10000);

  useEffect(() => {
    return () => {
      handleSyncUser();
    };
  }, []);

  useEffect(() => {
    if (staminaCount >= maxStamina) return;

    const interval = setInterval(() => {
      if (staminaCount < maxStamina) {
        setStaminaCount(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [staminaCount, maxStamina]);

  const update = async (count: number) => {
    if (!count) return;

    await createTransaction({
      type: 'tap',
      cnt: count - balancedCntRef.current,
    });

    balancedCntRef.current = count;
  };

  const debouncedUpdate = useCallback(debounce(update, 300), []);

  const handleMine = ({ x, y }: { x: number; y: number }) => {
    if (staminaCount <= (user?.multitapLevel ?? 1)) return;

    const clickCost = Number(user?.multitapLevel ?? 1);

    spendStamina.current += clickCost;

    setBalanceToLocalStorage((balance + clickCost).toString());

    const newClickCnt = clickCnt + clickCost;

    setClickCnt(newClickCnt);
    debouncedUpdate(newClickCnt);
    setStaminaCount(prev => prev - (user?.multitapLevel ?? 1));

    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

    setSpawns([...spawns, { x, y }]);
  };

  useEffect(() => {
    // until there are no spawns, remove the first added spawn every interval
    const interval = setInterval(() => {
      if (spawns.length > 0) {
        const newSpawns = [...spawns];
        newSpawns.shift();
        setSpawns(newSpawns);
      }
    }, 200);

    // cleanup
    return () => clearInterval(interval);
  }, [spawns]);

  if (!user) {
    return null;
  }

  return (
    <>
      {spawns.map((spawn, index) => (
        <Sparkle key={index} position={spawn} cost={user?.multitapLevel ?? 1} />
      ))}
      <Info user={user} />
      <Balance balance={balance} />
      <Taper
        onClick={event =>
          handleMine({
            x: event.clientX - 16,
            y: event.clientY,
          })
        }
        onTouchStart={event => {
          handleMine({
            x: event.touches[0].clientX - 16,
            y: event.touches[0].clientY,
          });
        }}
      />
      <Stamina stamina={staminaCount} maxStamina={maxStamina} />
    </>
  );
};

interface InfoProps {
  user: User;
}

const Info: FC<InfoProps> = ({ user }) => {
  return (
    <div className={styles.header}>
      <Link to={`/profile`} className={styles.badge}>
        <img src={user.avatar ?? UserIcon} alt="user_avatar" />
        <span>{`@${user?.username}`}</span>
      </Link>
      {user?.league && (
        <Link to={`/leagues/${user.league.id}`} className={styles.badge}>
          <img src={user.league?.avatar ?? LeagueIcon} alt="league_avatar" />
          <span>{user?.league?.name}</span>
        </Link>
      )}
    </div>
  );
};

interface BalanceProps {
  balance: number;
}

const Balance: FC<BalanceProps> = ({ balance }) => {
  return (
    <div className={styles.balance}>
      <div className={styles.balanceIcon}>
        <Star />
      </div>
      <h2>{formatNumber(balance)}</h2>
    </div>
  );
};

interface TaperProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void;
}

const Taper: FC<TaperProps> = ({ onClick, onTouchStart }) => {
  const isTouchSupported = typeof window !== 'undefined' && 'ontouchstart' in window;

  return (
    <button
      className={styles.tapContainer}
      onTouchStart={isTouchSupported ? onTouchStart : undefined}
      onClick={isTouchSupported ? undefined : onClick}
      type="button"
    >
      <div className={styles.tap}>
        <Lottie animationData={TaperAnimation} loop={true} />
        <div className={styles.tapMessage}>TAP</div>
      </div>
    </button>
  );
};

const Stamina = ({ stamina, maxStamina }: { stamina: number; maxStamina: number }) => {
  const percent = (stamina / maxStamina) * 100;
  return (
    <div className="select-none" style={{ marginTop: 20 }}>
      <div className={styles.staminaStats}>
        <p>
          ⚡ <b>Fap power</b> {stamina} / {maxStamina}
        </p>
        <Link to="/boosters">🚀 Boost</Link>
      </div>

      <ProgressBar percent={percent} />
    </div>
  );
};

export default MinePage;
