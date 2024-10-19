import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { TreadFactory } from '#database/factories/tread_factory';
import { UserFactory } from '#database/factories/user_factory';
import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads index', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should return a paginated list of treads', async ({ client, assert }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.apply('new').create();

    await TreadFactory.merge({ ownerId: user.id, leagueId: league.id }).createMany(15);

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client.get('/api/v1/treads').header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.properties(response.body(), ['data', 'meta']);
    assert.lengthOf(response.body().data, 10);
    assert.equal(response.body().meta.total, 15);
  });
});
