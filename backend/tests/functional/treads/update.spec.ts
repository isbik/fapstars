import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { TreadFactory } from '#database/factories/tread_factory';
import { UserFactory } from '#database/factories/user_factory';
import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads update', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should update a tread', async ({ client, assert }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const tread = await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).create();
    const updatedContent = 'Updated tread content';

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client
      .patch(`/api/v1/treads/${tread.id}`)
      .json({ content: updatedContent })
      .header('X-Token', 'fake-token');

    response.assertStatus(200);
    assert.equal(response.body().content, updatedContent);
  });

  test('should not update a tread owned by another user', async ({ client }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const anotherUser = await UserFactory.merge({ leagueId: league.id }).create();
    const tread = await TreadFactory.merge({ leagueId: league.id, ownerId: user.id }).create();
    const updatedContent = 'Updated tread content';

    mockUserMiddleware(parseInt(anotherUser.tgId));
    const response = await client
      .patch(`/api/v1/treads/${tread.id}`)
      .json({ content: updatedContent })
      .header('X-Token', 'fake-token');

    response.assertStatus(403);
  });
});
