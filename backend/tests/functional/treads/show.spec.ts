import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { TreadFactory } from '#database/factories/tread_factory';
import { UserFactory } from '#database/factories/user_factory';
import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads show', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should return a specific tread', async ({ client, assert }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const treads = await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).createMany(4);

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client.get(`/api/v1/treads/${treads[0].id}`).header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.properties(response.body(), ['id', 'content', 'ownerId', 'leagueId']);
    assert.equal(response.body().id, treads[0].id);
    assert.equal(response.body().content, treads[0].content);
  });

  test('should return 404 for non-existent tread', async ({ client }) => {
    const response = await client.get('/api/v1/treads/999').header('X-Token', 'fake-token');

    response.assertStatus(404);
  });
});
