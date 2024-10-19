import { IThread } from '../types';

import apiV1 from '~/shared/api/apiV1';

export interface ThreadPostReqBody {
  content: string;
  leagueId: string;
}

const postThread = async (body: ThreadPostReqBody): Promise<IThread> => {
  try {
    const { data } = await apiV1.post('treads', body);

    return data;
  } catch (error) {
    console.error('Error posting thread:', error);
    throw error;
  }
};

export default postThread;
