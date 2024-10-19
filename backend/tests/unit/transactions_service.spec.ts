import { test } from '@japa/runner';

import TransactionsService from '#services/transactions_service';

test.group('Transactions service', () => {
  test(`calc numbers "{$self}"`)
    .with([
      [0, 0, '0'],
      [0, 6000, '6000'],
      [1000, 6000, '7000'],
      [1000, -6000, '-5000'],
      [-1000, 6000, '5000'],
      [-1000, -6000, '-7000'],
    ])
    .run(({ assert }, row) => {
      const [a, b, expectation] = row;
      const res = TransactionsService.calc(a, b);
      assert.deepEqual(res, expectation);
    });

  test(`calc strings "{$self}"`)
    .with([
      ['0', '0', '0'],
      ['0', '6000', '6000'],
      ['1000', '6000', '7000'],
      ['1000', '-6000', '-5000'],
      ['-1000', '6000', '5000'],
      ['-1000', '-6000', '-7000'],
    ])
    .run(({ assert }, row) => {
      const [a, b, expectation] = row;
      const res = TransactionsService.calc(a, b);
      assert.deepEqual(res, expectation);
    });

  test(`calc numbers and strings "{$self}"`)
    .with([
      [0, '0', '0'],
      ['0', 0, '0'],
      [0, '6000', '6000'],
      ['0', 6000, '6000'],
      [1000, '6000', '7000'],
      ['1000', 6000, '7000'],
      [1000, '-6000', '-5000'],
      ['1000', -6000, '-5000'],
      [-1000, '6000', '5000'],
      ['-1000', 6000, '5000'],
      [-1000, '-6000', '-7000'],
      ['-1000', -6000, '-7000'],
    ])
    .run(({ assert }, row) => {
      const [a, b, expectation] = row;
      const res = TransactionsService.calc(a, b);
      assert.deepEqual(res, expectation);
    });
});
