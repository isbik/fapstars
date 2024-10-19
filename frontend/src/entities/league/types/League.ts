import { User } from '~/entities/user/types';

interface League {
  id: string;
  ownerId: string;
  name: string;
  avatar: string | null;
  balance: string;
  socialLink: string;
  isAiModel: boolean;
  isVerified: boolean;
  needVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  members_count?: number;
  countryCode?: string;
}

export default League;
