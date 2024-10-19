import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  BoostersPage,
  EarnPage,
  InvitedModelsPage,
  Layout,
  LeagueCreatePage,
  LeagueDetailPage,
  LeagueEditPage,
  LeaguesPage,
  MinePage,
  NotFoundPage,
  NotImplementedPage,
  OnBoardingPage,
  ProfilePage,
  RegisterPage,
  SandBoxPage,
  UserPage,
} from '~/pages';
import LeagueThreads from '~/pages/Leagues/threads/LeagueThreads';

const Router: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/leagues" replace state={{ hideBack: true }} />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/leagues" element={<LeaguesPage />}></Route>
        <Route path="/leagues/create" element={<LeagueCreatePage />} />
        <Route path="/leagues/:leagueId" element={<LeagueDetailPage />} />
        <Route path="/leagues/:leagueId/edit" element={<LeagueEditPage />} />
        <Route path="/leagues/:leagueId/threads" element={<LeagueThreads />} />

        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/users/:userId/invited_models" element={<InvitedModelsPage />} />

        <Route path="/mine" element={<MinePage />} />
        <Route path="/battle" element={<NotImplementedPage />} />
        <Route path="/myleague" element={<NotImplementedPage />} />
        <Route path="/earn" element={<EarnPage />} />
        <Route path="/boosters" element={<BoostersPage />} />
      </Route>

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboard" element={<OnBoardingPage />} />
      <Route path="/sandbox" element={<SandBoxPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
