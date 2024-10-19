import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import type { NextFn } from '@adonisjs/core/types/http';

import { GlobalAuthentication } from '../modules/index.js';

import env from '#start/env';

@inject()
export default class VerifyUserMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const dataCheckString = request.header('X-Token');
    const botToken = env.get('BOT_TOKEN');

    if (!dataCheckString) {
      return response.status(401).send('Unauthorized: No token provided');
    }
    if (!botToken) {
      return response.status(500).send('Internal Server Error: Inner token not provided');
    }

    const isVerifiedInitData = GlobalAuthentication.verifyInitData({ initData: dataCheckString, botToken });

    if (!isVerifiedInitData) {
      logger.error(`VERIFY_USER_MIDDLEWARE: invalid token`);
      return response.status(401).send('Unauthorized: Invalid token');
    }

    const user = await GlobalAuthentication.extractUserFromInitData({ initData: dataCheckString });

    if (!user) {
      return response.status(404).send('Unauthorized: Invalid token, user not found');
    }

    request.user = user;

    const output = await next();
    return output;
  }
}
