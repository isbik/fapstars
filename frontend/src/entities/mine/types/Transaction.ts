import { User } from '~/entities/user/types';

interface Transaction {
  id: string;
  ownerId: string;
  value: string;
  type: 'item' | 'tap' | 'task' | 'invite' | 'extra';
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export default Transaction;
