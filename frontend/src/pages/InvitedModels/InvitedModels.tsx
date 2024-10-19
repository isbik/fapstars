import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { League } from '~/entities/league/types';
import { LeagueList } from '~/entities/league/ui';
import { getUserInvitedModels } from '~/entities/user/api/getUserInvitedModels';

const InvitedModelsPage = () => {
  const { userId } = useParams();
  const [models, setModels] = React.useState<League[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      getUserInvitedModels(userId)
        .then(({ data }) => {
          if (data) setModels(data.models);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId]);

  return (
    <>
      <LeagueList leagues={models} isLoading={isLoading} emptyText="Models not found" />
    </>
  );
};

export { InvitedModelsPage };
