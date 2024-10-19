// import { UserFactory } from '#database/factories/user_factory'
// import Transaction from '#models/transaction'
// // import testUtils from '@adonisjs/core/services/test_utils'
// import { test } from '@japa/runner'

// test.group('Create transactions', (group) => {

// group.each.setup(() => testUtils.db().withGlobalTransaction())

// test('success creating transactions', async ({ client, assert }) => {
//   const user = await UserFactory.apply('new').create()
//   const payload = {
//     cnt: 100,
//     type: 'tap',
//   }

//   const response = await client.post('api/v1/balance')
//     .json(payload)
//     // .header('X-Token', )

//   response.assertStatus(204)
//   const transaction = await Transaction.findBy('ownerId', user.id)

//   assert.exists(transaction)
//   assert.equal(transaction?.ownerId, 1)
// })
// })
