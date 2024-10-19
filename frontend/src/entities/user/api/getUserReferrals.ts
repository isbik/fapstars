import { ReferralsResponse } from '../types';

import apiV1 from '~/shared/api/apiV1';
import { APIResponse } from '~/shared/types';

const getUserReferrals = async (userId: string, limit?: number): Promise<APIResponse<ReferralsResponse>> => {
  const url = `users/${userId}/referrals`;

  const { data } = await apiV1.get(url, {
    params: {
      limit: limit,
    },
  });

  return data;
};

export default getUserReferrals;
