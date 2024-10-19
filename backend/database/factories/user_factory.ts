import factory from '@adonisjs/lucid/factories';

import { LeagueFactory } from './league_factory.js';

import User from '#models/user';

export const UserFactory = factory
  .define(User, ({ faker }) => {
    return {
      leagueId: faker.number.int({ min: 0, max: 100_000 }).toString(),
      tgId: faker.number.int({ min: 0, max: 100_000 }).toString(),
      username: faker.internet.userName(),
      hasPremium: faker.datatype.boolean(),
      balance: faker.number.int({ min: 0, max: 100_000 }).toString(),
    };
  })
  .state('new', user => (user.leagueId = null))
  .state('premium', user => (user.hasPremium = true))
  .relation('league', () => LeagueFactory)
  .relation('referrer', () => UserFactory)
  .build();
