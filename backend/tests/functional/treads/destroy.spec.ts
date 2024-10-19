import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { TreadFactory } from '#database/factories/tread_factory';
import { UserFactory } from '#database/factories/user_factory';
import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads destroy', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should delete a tread by tread author', async ({ client, assert }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const tread = await TreadFactory.merge({ ownerId: user.id, leagueId: league.id }).create();

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client.delete(`/api/v1/treads/${tread.id}`).header('X-Token', 'fake-token');

    response.assertStatus(204);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const deletedTread = await tread.refresh().catch(() => null);
    assert.isNull(deletedTread);
  });

  test('should delete a tread by league owner', async ({ client, assert }) => {
    const { author, league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const tread = await TreadFactory.merge({ ownerId: user.id, leagueId: league.id }).create();

    mockUserMiddleware(parseInt(author.tgId));
    const response = await client.delete(`/api/v1/treads/${tread.id}`).header('X-Token', 'fake-token');

    response.assertStatus(204);

    const deletedTread = await tread.refresh().catch(() => null);
    assert.isNull(deletedTread);
  });

  test('should not delete a tread owned by another user', async ({ client }) => {
    const { league } = await makeAuthor();
    const user = await UserFactory.merge({ leagueId: league.id }).create();
    const tread = await TreadFactory.merge({ ownerId: user.id, leagueId: league.id }).create();
    const anoterUser = await UserFactory.merge({ leagueId: league.id }).create();

    mockUserMiddleware(parseInt(anoterUser.tgId));
    const response = await client.delete(`/api/v1/treads/${tread.id}`).header('X-Token', 'fake-token');

    response.assertStatus(403);
  });
});
