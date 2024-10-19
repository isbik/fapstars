import factory from '@adonisjs/lucid/factories';

import Tread from '#models/tread';

export const TreadFactory = factory
  .define(Tread, ({ faker }) => {
    return {
      content: faker.lorem.sentence(),
    };
  })
  .build();
