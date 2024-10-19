import dayjs from 'dayjs';

import { League } from '../types';

export const isExpiredVerification = ({ league }: { league?: League | undefined | null }) => {
  if (!league || !league.needVerifiedAt) return true;
  return dayjs().diff(league.needVerifiedAt) > 0;
};
