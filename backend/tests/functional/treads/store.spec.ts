import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import makeAuthor from '#tests/mocks/make_author';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Treads store', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should create a new tread', async ({ client, assert }) => {
    const { author } = await makeAuthor();
    const payload = {
      content: 'Test tread content',
      leagueId: author.leagueId,
    };

    mockUserMiddleware(parseInt(author.tgId));
    const response = await client.post('/api/v1/treads').json(payload).header('X-Token', 'fake-token');

    response.assertStatus(201);
    assert.properties(response.body(), ['id', 'content', 'ownerId', 'leagueId']);
    assert.equal(response.body().content, payload.content);
    assert.equal(response.body().ownerId, author.id);
    assert.equal(response.body().leagueId, author.leagueId);
  });
});
