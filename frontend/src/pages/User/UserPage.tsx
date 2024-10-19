import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { searchUser } from '~/entities/user/api';
import { User } from '~/entities/user/types';
import { UserPageInfo } from '~/widgets/UserPage/UserPage';

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    searchUser({
      filter: {
        id: userId,
      },
      include: ['league'],
    })
      .then(({ data }) => {
        data && setUser(data[0]);
      })
      .catch(({ status }) => {
        if (status === 404) setUser(null);
      });
  }, [userId]);

  if (!user) return null;

  return <UserPageInfo user={user} />;
};

export { UserPage };
