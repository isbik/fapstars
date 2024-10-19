import factory from '@adonisjs/lucid/factories';

import { TreadFactory } from './tread_factory.js';

import League from '#models/league';

export const LeagueFactory = factory
  .define(League, ({ faker }) => {
    return {
      name: faker.internet.userName(),
      balance: faker.number.int({ min: 0, max: 100_000 }).toString(),
      socialLink: faker.internet.url(),
      isAiModel: faker.datatype.boolean(),
      isVerified: faker.datatype.boolean(),
    };
  })
  .state('verified', league => (league.isVerified = true))
  .state('aiModel', league => (league.isAiModel = true))
  .relation('treads', () => TreadFactory)
  .build();
