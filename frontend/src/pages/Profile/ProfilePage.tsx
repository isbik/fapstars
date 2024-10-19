import useAuth from '~/app/context/auth/useAuth';
import { useUserBalance } from '~/entities/user/hooks/useUserBalance';
import { UserPageInfo } from '~/widgets/UserPage/UserPage';

const ProfilePage = () => {
  const { user } = useAuth();
  const balance = useUserBalance();

  if (!user) {
    return null;
  }

  return <UserPageInfo user={{ ...user, balance: String(balance) }} />;
};

export default ProfilePage;
