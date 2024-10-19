import { League } from '~/entities/league/types';

interface User {
  id: string;
  tgId: string;
  username: string;
  leagueId: string | null;
  referrerId: string | null;
  hasPremium: boolean;
  avatar?: string;
  balance: string;
  // boosters
  fullEnergyBoosterAt: string;
  fullTurboBoosterAt: string;
  multitapLevel: number;
  energyLimitLevel: number;
  staminaSpendAt: string;

  // rewards
  dailyAwardSteak: number;
  dailyAwardClaimedAt: string;

  // references
  referrer?: User;
  league?: League;

  createdAt: string;
  updatedAt: string;
}

export default User;
