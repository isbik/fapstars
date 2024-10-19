import { COINS_TO_VERIFY_LEAGUE } from '../modules/leagues/index.js';
import { DAILY_REWARDS } from '../modules/user_config/dayly_rewards.js';

export default class CommonController {
  /**
   * @configs
   * @operationId getConfigs
   * @description Returns configs
   * @responseBody 200 - {dailyRewards: DAILY_REWARDS, coinsToVerifyLeague: number}
   * @responseBody 400 - Bad request
   */
  configs() {
    return {
      dailyRewards: DAILY_REWARDS,
      coinsToVerifyLeague: COINS_TO_VERIFY_LEAGUE,
    };
  }
}
