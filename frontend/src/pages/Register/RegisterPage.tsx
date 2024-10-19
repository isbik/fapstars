import Lottie from 'lottie-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '~/app/context/auth/useAuth';
import StarAnimation from '~/assets/stikers/star.json';
import { createUserAccount } from '~/entities/user/api';
import { useQuery, useTelegram } from '~/shared/models';
import { Button, Spinner } from '~/shared/ui';

const RegisterPage: FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const { setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    tg.BackButton.hide();
  }, [tg]);

  const handleOnClick = () => {
    if (tg.initDataUnsafe.user?.username) {
      setIsLoading(true);
      createUserAccount({
        tgId: tg.initDataUnsafe.user.id.toString(),
        hasPremium: tg.initDataUnsafe.user.is_premium || false,
        username: tg.initDataUnsafe.user.username,
        referrer: query.get('referrer') ?? null,
        avatar: tg.initDataUnsafe.user.photo_url ?? null,
      })
        .then(data => {
          setUser(data);
          data && navigate('/onboard', { replace: true });
        })
        .catch(
          error => error && console.error(error), // TODO: Воводить нотификейшн пользователю)
        )
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      throw new Error('Telegram data lost');
    }
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: '100vh',
      }}
    >
      <div className="image" style={{ margin: 'auto', width: '85%' }}>
        <Lottie animationData={StarAnimation} loop={true} />
      </div>
      <div
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <p
          style={{
            textAlign: 'center',
          }}
        >
          Form teams of amazing girls
          <br />
          and artificial intelligence models.
          <br />
          Compete, win and earn FAP coins!
        </p>
      </div>
      <Button onClick={handleOnClick}>{isLoading ? <Spinner className="text-white" /> : 'Create account'}</Button>
    </div>
  );
};

export default RegisterPage;
