import { League } from '~/entities/league/types';
import apiV1 from '~/shared/api/apiV1';
import { APIResponse } from '~/shared/types';

const getUserInvitedModels = async (
  userId: string,
  limit?: number,
): Promise<APIResponse<{ models: League[]; count: number }>> => {
  const url = `users/${userId}/invited_models`;

  const { data } = await apiV1.get(url, {
    params: {
      limit: limit,
    },
  });

  return data;
};

export { getUserInvitedModels };
