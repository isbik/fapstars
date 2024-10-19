import type { HttpContext } from '@adonisjs/core/http';

import { buyEverydayBooster, upgradeBoosterLevel } from '#services/boosters_service';

export default class BoosterController {
  /**
   * @full_energy
   * @operationId buyFullEnergyBooster
   * @description Buy full energy booster
   * @responseBody 200 - <User>
   * @responseBody 400 - You can only buy full energy one time per 4 hours
   */
  async full_energy({ request, response }: HttpContext) {
    try {
      return await buyEverydayBooster(request.user.id, 'fullEnergyBoosterAt');
    } catch (error) {
      return response.status(400).json({ message: 'You can only buy full energy one time per 4 hours' });
    }
  }

  /**
   * @full_turbo
   * @operationId buyFullTurboBooster
   * @description Buy full turbo booster
   * @responseBody 200 - <User>
   * @responseBody 400 - You can only buy turbo one time per 4 hours
   */
  async buy_turbo({ request, response }: HttpContext) {
    try {
      return await buyEverydayBooster(request.user.id, 'fullTurboBoosterAt');
    } catch (error) {
      return response.status(400).json({ message: 'You can only buy turbo one time per 4 hours' });
    }
  }

  /**
   * @upgrade_multitap_level
   * @operationId upgradeMultitapLevel
   * @description Upgrade multitap
   * @responseBody 200 - <User>
   * @responseBody 400 - Not enough money
   */
  async upgrade_multitap_level({ request, response }: HttpContext) {
    try {
      return await upgradeBoosterLevel(request.user.id, 'multitapLevel');
    } catch (error) {
      return response.status(400).json({ message: 'Not enough money' });
    }
  }

  /**
   * @upgrade_energy_limit_level
   * @operationId upgradeEnergyLimitLevel
   * @description Upgrade energy limit
   * @responseBody 200 - <User>
   * @responseBody 400 - Not enough money
   */
  async upgrade_energy_limit_level({ request, response }: HttpContext) {
    try {
      return await upgradeBoosterLevel(request.user.id, 'energyLimitLevel');
    } catch (error) {
      return response.status(400).json({ message: 'Not enough money' });
    }
  }
}
