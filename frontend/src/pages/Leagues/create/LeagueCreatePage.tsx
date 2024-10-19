import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '~/app/context/auth/useAuth';
import { createLeague } from '~/entities/league/api';
import { CreateLeagueRequest } from '~/entities/league/types';
import { LeagueForm } from '~/entities/league/ui/LeagueForm';
import { ValidationError } from '~/shared/types';
import { Drawer } from '~/shared/ui';
import { pluckToMap } from '~/shared/utils';

const LeagueCreatePage: FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Map<ValidationError[keyof ValidationError], ValidationError> | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>, payload: Partial<CreateLeagueRequest>) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('ownerId', user.id);
    formData.set('countryCode', payload?.countryCode ?? '');

    createLeague(formData)
      .then(data => {
        if (data) {
          setUser({ ...user, leagueId: data.id });
          setIsDrawerVisible(true);
          setTimeout(() => {
            navigate(`/leagues/${data.id}`);
          }, 1000);
        }
      })
      .catch(({ data }) => {
        return data && setErrors(pluckToMap(data.errors, 'field'));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <LeagueForm onSubmit={handleSubmit} isLoading={isLoading} errors={errors} />
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
            League created!
          </p>
        </div>
      </Drawer>
    </>
  );
};

export default LeagueCreatePage;
