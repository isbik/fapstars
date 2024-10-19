import { inject } from '@adonisjs/core';
import { Job } from '@rlanz/bull-queue';
import queue from '@rlanz/bull-queue/services/main';

import UserBalanceRecalculationJob from './user_balance_recalculation_job.js';

import User from '#models/user';
import TransactionsService from '#services/transactions_service';

interface ReferralAwardJobPayload {
  referrerUsername: string;
  referralHasPremium: boolean;
}

@inject()
export default class ReferralAwardJob extends Job {
  static simpleReferralAward: number = 2000;
  static referralPremiumAward: number = 5000;

  constructor(protected transactionsService: TransactionsService) {
    super();
  }

  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Base Entry point
   */
  async handle(payload: ReferralAwardJobPayload) {
    const referrer = await User.findBy('username', payload.referrerUsername);
    if (referrer) {
      const award = payload.referralHasPremium
        ? ReferralAwardJob.referralPremiumAward
        : ReferralAwardJob.simpleReferralAward;

      await this.transactionsService.create({
        ownerId: referrer.id,
        value: award.toString(),
        type: 'invite',
      });

      await queue.dispatch(UserBalanceRecalculationJob, { userId: referrer.id });
    }
  }

  /**
   * This is an optional method that gets called when the retries have exceeded and are marked failed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rescue(_: ReferralAwardJobPayload) {}
}
