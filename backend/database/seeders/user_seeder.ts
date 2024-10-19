import { BaseSeeder } from '@adonisjs/lucid/seeders';

import { LeagueFactory } from '#database/factories/league_factory';
import { UserFactory } from '#database/factories/user_factory';

export default class extends BaseSeeder {
  async run() {
    const owners = await UserFactory.apply('new').createMany(10);
    const _owners = owners.map(owner => {
      return {
        ownerId: owner.id,
      };
    });
    const leagues = await LeagueFactory.merge(_owners).createMany(10);
    const _leagues = leagues.map(league => {
      return {
        leagueId: league.id,
      };
    });
    for (let i = 0; i < 10; i++) {
      await UserFactory.merge(_leagues).createMany(10);
    }
  }
}
