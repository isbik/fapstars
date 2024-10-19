import app from '@adonisjs/core/services/app';

import TelegramAuthService from '#services/telegram_auth_service';

const mockUserMiddleware = (tgId: number) => {
  class FakeTelegramAuthService extends TelegramAuthService {
    verifyTelegramWebAppData() {
      return true;
    }

    parseUserId() {
      return tgId;
    }
  }

  app.container.swap(TelegramAuthService, () => {
    return new FakeTelegramAuthService();
  });
};

export default mockUserMiddleware;
