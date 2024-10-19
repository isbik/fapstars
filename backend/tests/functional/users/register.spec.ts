import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';
import queue from '@rlanz/bull-queue/services/main';

import ReferralAwardJob from '../../../app/jobs/referral_award_job.js';

import { LeagueFactory } from '#database/factories/league_factory';
import { UserFactory } from '#database/factories/user_factory';
import League from '#models/league';
import User from '#models/user';

test.group('Users register', group => {
  group.each.setup(() => testUtils.db().withGlobalTransaction());
  group.each.setup(() => {
    queue.process({ queueName: 'default' });
  });

  group.each.teardown(async () => {
    await queue.clear();
  });
  group.teardown(() => {});

  test('register', async ({ client }) => {
    const response = await client.post('api/v1/users').json({
      tgId: '1',
      username: 'johndoe',
      referrer: null,
      hasPremium: false,
      avatar: null,
    });

    response.assertStatus(200);
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  test('register with referrer', async ({ assert, client, sleep }) => {
    const referer = await UserFactory.apply('new').create();

    const response = await client.post('api/v1/users').json({
      tgId: '1',
      username: 'johndoe',
      referrer: referer.username,
      hasPremium: false,
      avatar: null,
    });

    response.assertStatus(200);
    response.assertBodyContains({
      referrerId: referer.id,
      leagueId: null,
    });

    // assert reward
    await sleep(1000);
    const user = (await User.find(referer.id)) as User;
    const balanceDiff = parseInt(user?.balance) - parseInt(referer.balance);
    assert.equal(balanceDiff, ReferralAwardJob.simpleReferralAward);
  });

  test('register with referrer with league', async ({ assert, client, sleep }) => {
    const referer = await UserFactory.apply('new').create();
    const league = await LeagueFactory.merge({ ownerId: referer.id }).create();
    referer.leagueId = league.id;
    await referer.save();

    const response = await client.post('api/v1/users').json({
      tgId: '1',
      username: 'johndoe',
      referrer: referer.username,
      hasPremium: false,
      avatar: null,
    });

    response.assertStatus(200);
    response.assertBodyContains({
      referrerId: referer.id,
      leagueId: referer.leagueId.toString(),
    });

    // assert reward
    await sleep(1000);
    const awardedUser = (await User.find(referer.id)) as User;
    const balanceDiff = parseInt(awardedUser?.balance) - parseInt(referer.balance);
    assert.equal(balanceDiff, ReferralAwardJob.simpleReferralAward);
    const awardedLeague = (await League.find(referer.leagueId)) as League;
    const leagueBalanceDiff = parseInt(awardedLeague?.balance) - parseInt(league.balance);
    assert.equal(leagueBalanceDiff, ReferralAwardJob.simpleReferralAward);
  });
});
