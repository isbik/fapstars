import { FC, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import LoaderScreen from './LoaderScreen';

import useAuth from '~/app/context/auth/useAuth';
import { searchUser } from '~/entities/user/api';
import { useQuery, useTelegram } from '~/shared/models';
import { Navigation } from '~/widgets/Navigation';

/**
 * Состояние страницы завязано на сущность user
 * (user == undefined) - приложение ещё не инициализировано
 * (user == null) - пользователя нет в базе => регистрация
 * (user == {...}) - пользователь уже есть в базе => главая
 */
const Layout: FC = () => {
  const { user, setUser } = useAuth();

  const { tg } = useTelegram();
  const tgUserId = tg.initDataUnsafe?.user?.id.toString();

  const query = useQuery();
  const referrer = query.get('referrer');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const goBack = () => navigate(-1);

    if (location.key === 'default' || location.state?.hideBack) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
      tg.BackButton.onClick(goBack);
    }
    return () => {
      tg.BackButton.offClick(goBack);
    };
  }, [tg, location.pathname, navigate]);

  useEffect(() => {
    if (!tgUserId) return;

    searchUser({
      filter: {
        tgId: tgUserId,
      },
      include: ['league'],
    })
      .then(({ data }) => {
        data && setUser(data[0]);
      })
      .catch(({ status }) => {
        if (status === 404) setUser(null);
      });
  }, [tgUserId]);

  // Если приложение открыто не через телеграм, выходим
  if (!tgUserId) return;

  // Временный экран, пока идёт инициализация
  if (user === undefined) {
    return <LoaderScreen />;
  }

  if (user === null) {
    return <Navigate to={referrer ? `/register?referrer=${referrer}` : `/register`} replace />;
  }

  return (
    <div className="page">
      <div className="container relative flex flex-col flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Navigation />
    </div>
  );
};

export default Layout;
