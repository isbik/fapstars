import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

test.group('Users list', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('get a list of users without X-Token', async ({ client }) => {
    const response = await client.get('api/v1/users');
    response.assertStatus(401);
  });
});
