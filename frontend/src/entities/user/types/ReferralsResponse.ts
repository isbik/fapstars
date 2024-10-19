import User from './User';

interface ReferralsResponse {
  referrals: User[];
  count: number;
  modelsCount: number;
  totalBalance: number;
}

export default ReferralsResponse;
