import { User } from '~/entities/user/types';

interface IThread {
  id: string;
  ownerId: string;
  leagueId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  owner?: User;
}

export default IThread;
