import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { TreadFactory } from '#database/factories/tread_factory';
import { UserFactory } from '#database/factories/user_factory';
import Tread from '#models/tread';
import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads search', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should search treads by leagueId', async ({ client, assert }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).createMany(5);

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client
      .post('/api/v1/treads/search')
      .json({ filter: { leagueId: league.id.toString() } })
      .header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.lengthOf(response.body().data, 5);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    response.body().data.forEach((tread: Tread) => {
      assert.equal(tread.leagueId, league.id);
    });
  });

  test('should search treads by ownerId', async ({ client, assert }) => {
    const { author, league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).createMany(4);
    await TreadFactory.merge({ leagueId: league.id, ownerId: author.id }).createMany(3);

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client
      .post('/api/v1/treads/search')
      .json({ filter: { ownerId: user.id.toString() } })
      .header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.lengthOf(response.body().data, 4);
    response.body().data.forEach((tread: Tread) => {
      assert.equal(tread.ownerId, user.id);
    });
  });

  test('should search treads by ownerUsername', async ({ client, assert }) => {
    const { author, league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).createMany(4);
    await TreadFactory.merge({ leagueId: league.id, ownerId: author.id }).createMany(3);

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client
      .post('/api/v1/treads/search')
      .json({ filter: { ownerUsername: author.username } })
      .header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.lengthOf(response.body().data, 3);
    response.body().data.forEach((tread: Tread) => {
      assert.equal(tread.ownerId, author.id);
    });
  });

  test('should search treads by leagueName', async ({ client, assert }) => {
    const { author: a1, league: l1 } = await makeAuthor();
    const { author: a2, league: l2 } = await makeAuthor();
    await TreadFactory.merge({ leagueId: l1.id, ownerId: a1.id }).createMany(4);
    await TreadFactory.merge({ leagueId: l2.id, ownerId: a2.id }).createMany(3);

    mockUserMiddleware(parseInt(a1.tgId));
    const response = await client
      .post('/api/v1/treads/search')
      .json({ filter: { leagueName: l1.name } })
      .header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.lengthOf(response.body().data, 4);
    response.body().data.forEach((tread: Tread) => {
      assert.equal(tread.ownerId, a1.id);
    });
  });
});
