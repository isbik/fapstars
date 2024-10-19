import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user_factory';
import mockUserMiddleware from '#tests/mocks/user_middleware_mock';

test.group('Users register', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());

  test('should filter users by id', async ({ assert, client }) => {
    const user = await UserFactory.apply('new').create();

    mockUserMiddleware(parseInt(user.tgId));
    const response = await client
      .post('api/v1/users/search')
      .json({
        filter: { id: user.id.toString() },
      })
      .header('X-Token', 'foo');

    response.assertStatus(200);
    assert.lengthOf(response.body().data, 1);
    assert.equal(response.body().data[0].id, user.id);
  });

  // test('should filter users by username', async ({ client, assert }) => {
  //   const username = 'unique_username'
  //   const user = await UserFactory.merge({ username }).create()

  //   const response = await client.post('/users/search').json({
  //     filter: { username },
  //   })

  //   response.assertStatus(200)
  //   assert.lengthOf(response.body(), 1)
  //   assert.equal(response.body()[0].username, username)
  // })

  // test('should filter users by usernameLike', async ({ client, assert }) => {
  //   const username = 'partial_username'
  //   await UserFactory.merge({ username: `${username}_123` }).create()

  //   const response = await client.post('/users/search').json({
  //     filter: { usernameLike: username },
  //   })

  //   response.assertStatus(200)
  //   assert.lengthOf(response.body(), 1)
  //   assert.match(response.body()[0].username, new RegExp(username))
  // })

  // test('should filter users by hasPremium', async ({ client, assert }) => {
  //   const premiumUser = await UserFactory.state('premium').create()

  //   const response = await client.post('/users/search').json({
  //     filter: { hasPremium: true },
  //   })

  //   response.assertStatus(200)
  //   assert.lengthOf(response.body(), 1)
  //   assert.isTrue(response.body()[0].hasPremium)
  // })

  // test('should filter users by referrer name', async ({ client, assert }) => {
  //   const referrer = await UserFactory.create()
  //   const user = await UserFactory.merge({ referrerId: referrer.id }).create()

  //   const response = await client.post('/users/search').json({
  //     filter: { referrerName: referrer.username },
  //   })

  //   response.assertStatus(200)
  //   assert.lengthOf(response.body(), 1)
  //   assert.equal(response.body()[0].id, user.id)
  // })

  // test('should return all users when no filters applied', async ({ client, assert }) => {
  //   const response = await client.post('/users/search').json({})

  //   response.assertStatus(200)
  //   assert.lengthOf(response.body(), 10)
  // })
});
