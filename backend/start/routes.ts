/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import AutoSwagger from 'adonis-autoswagger';

import { middleware } from './kernel.js';

import swagger from '#config/swagger';
const UsersController = () => import('#controllers/users_controller');
const LeaguesController = () => import('#controllers/leagues_controller');
const TransactionsController = () => import('#controllers/transactions_controller');
const UploadsController = () => import('#controllers/uploads_controller');
const HealthController = () => import('#controllers/health_controller');
const TreadsController = () => import('#controllers/treads_controller');
const BoosterController = () => import('#controllers/boosters_controller');
const RewardsController = () => import('#controllers/rewards_controller');
const CommonController = () => import('#controllers/common_controller');

router
  .group(() => {
    router.get('', () => ({ health: 'ok' }));
    router.get('/s3', [HealthController, 's3']);
    router.get('/db', [HealthController, 'db']);
  })
  .prefix('/health');

router.get('/swagger', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

router.get('/docs', () => {
  return AutoSwagger.default.ui('/swagger', swagger);
});

router
  .group(() => {
    router
      .group(() => {
        // with auth
        router
          .group(() => {
            router.get('/me', [UsersController, 'me']);
            router.get('/configs', [CommonController, 'configs']);

            // Users
            router
              .group(() => {
                router.get('/', [UsersController, 'index']);
                router.get('/:id', [UsersController, 'show']);
                router.get('/:id/referrals', [UsersController, 'referrals']);
                router.get('/:id/invited_models', [UsersController, 'invited_models']);
                router.post('/search', [UsersController, 'search']);
                router.post('/sync', [UsersController, 'sync']);
                router.patch('/', [UsersController, 'update']);
              })
              .prefix('users');

            // Leagues
            router
              .group(() => {
                router.get('/', [LeaguesController, 'index']);
                router.post('/', [LeaguesController, 'store']);
                router.post('/search', [LeaguesController, 'search']);
                router.get('/enter/:id', [LeaguesController, 'enter']);
                router.get('/exit', [LeaguesController, 'exit']);
                router.patch('/:id', [LeaguesController, 'update']);
                router.get('/:id', [LeaguesController, 'show']);
                router.delete('/:id', [LeaguesController, 'destroy']);
              })
              .prefix('leagues');

            // Threads
            router
              .group(() => {
                router.get('/', [TreadsController, 'index']);
                router.post('/', [TreadsController, 'store']);
                router.get('/:id', [TreadsController, 'show']);
                router.patch('/:id', [TreadsController, 'update']);
                router.delete('/:id', [TreadsController, 'destroy']);
                router.post('/search', [TreadsController, 'search']);
              })
              .prefix('treads');

            // Boosters
            router
              .group(() => {
                router.post('/buy_full_energy', [BoosterController, 'full_energy']);
                router.post('/buy_turbo', [BoosterController, 'buy_turbo']);
                router.post('/upgrade_multitap_level', [BoosterController, 'upgrade_multitap_level']);
                router.post('/upgrade_energy_limit_level', [BoosterController, 'upgrade_energy_limit_level']);
              })
              .prefix('boosters');

            // rewards

            router
              .group(() => {
                router.post('/daily', [RewardsController, 'daily']);
              })
              .prefix('rewards');

            router.post('/balance/', [TransactionsController, 'store']);
            router.post('/upload/', [UploadsController, 'upload']);
          })
          .use(middleware.verifyUser());

        router.post('/users', [UsersController, 'register']);
      })
      .prefix('v1');
  })
  .prefix('api');
