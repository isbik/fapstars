import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

import { DAILY_REWARDS } from '../modules/user_config/dayly_rewards.js';

import User from '#models/user';

export default class RewardsController {
  /**
   * @daily
   * @operationId daily
   * @description Daily rewards
   * @responseBody 200 - <User>
   */
  async daily({ request, response }: HttpContext) {
    const user = await User.findOrFail(request.user.id);

    const dailyAwardClaimedAt = user.dailyAwardClaimedAt ?? DateTime.now();

    const days = DateTime.now().diff(dailyAwardClaimedAt, 'days').as('days');
    const isSameDay = dailyAwardClaimedAt.hasSame(DateTime.now(), 'day');

    if (isSameDay && user.dailyAwardSteak !== 0) {
      return response.status(400).json({ message: 'You can claim only once a day' });
    }

    const streak = days > 1 ? 1 : Math.min(user.dailyAwardSteak + 1, Object.keys(DAILY_REWARDS).length);

    const award = DAILY_REWARDS[streak];

    const now = DateTime.now();

    await User.query()
      .where({ id: user.id })
      .update({
        dailyAwardSteak: streak,
        dailyAwardClaimedAt: now,
        balance: Number(user.balance) + award,
      });

    return {
      dailyAwardSteak: streak,
      dailyAwardClaimedAt: now,
      award,
    };
  }
}
