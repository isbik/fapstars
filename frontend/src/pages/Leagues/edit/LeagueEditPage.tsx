import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuth from '~/app/context/auth/useAuth';
import { getLeagueById, updateLeague } from '~/entities/league/api';
import { CreateLeagueRequest } from '~/entities/league/types';
import { LeagueForm } from '~/entities/league/ui/LeagueForm';
import { ValidationError } from '~/shared/types';
import { Drawer } from '~/shared/ui';
import { pluckToMap } from '~/shared/utils';

const LeagueEditPage: FC = () => {
  const { user, setUser } = useAuth();
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<Pick<
    CreateLeagueRequest,
    'name' | 'socialLink' | 'isAiModel' | 'avatar' | 'countryCode'
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Map<ValidationError[keyof ValidationError], ValidationError> | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!leagueId) return;
    getLeagueById(leagueId).then(league => {
      if (league.ownerId !== user?.id) {
        navigate('/leagues');
        return;
      }

      setPayload(league);
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !leagueId) return;

    const formData = new FormData(e.currentTarget);

    formData.append('ownerId', user.id);

    payload?.isAiModel ? formData.set('isAiModel', 'true') : formData.append('isAiModel', 'false');
    formData.set('countryCode', payload?.countryCode ?? '');

    setIsLoading(true);

    updateLeague(leagueId, formData)
      .then(data => {
        if (!data) return;
        setIsDrawerVisible(true);
        setUser({ ...user, league: data });

        setTimeout(() => {
          navigate(`/leagues/${data.id}`);
        }, 1000);
      })
      .catch(({ data }) => data && setErrors(pluckToMap(data.errors, 'field')))
      .finally(() => setIsLoading(false));
  };

  if (!payload) return <p>Loading...</p>;

  return (
    <>
      <LeagueForm initPayload={payload} onSubmit={handleSubmit} isLoading={isLoading} errors={errors} />
      <Drawer isVisible={isDrawerVisible} withCross onClose={() => {}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: 280,
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: 40,
            }}
          >
            League updated!
          </p>
        </div>
      </Drawer>
    </>
  );
};

export default LeagueEditPage;
