import { BaseEvent } from '@adonisjs/core/events';
import logger from '@adonisjs/core/services/logger';

import User from '#models/user';

export default class UserLeagueChangedEvent extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public user: User,
    public type: 'ENTER' | 'EXIT',
    public leagueId: string,
  ) {
    logger.info(`USER with id=${user.id} ${type} league with id=${leagueId}`);
    super();
  }
}
