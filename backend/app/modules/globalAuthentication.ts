import CryptoJS from 'crypto-js';

import User from '#models/user';
import TelegramAuthService from '#services/telegram_auth_service';

export class GlobalAuthentication {
  private static readonly telegramAuthService = new TelegramAuthService();

  static verifySignatureToken(params: { signatureToken: string; secretToken: string; message: string }): boolean {
    const { signatureToken, secretToken, message } = params;

    const result = CryptoJS.HmacSHA256(message, secretToken).toString(CryptoJS.enc.Hex);

    return result === signatureToken;
  }

  static verifyInitData(params: { initData: string; botToken: string }): boolean {
    const { initData, botToken } = params;

    return GlobalAuthentication.telegramAuthService.verifyTelegramWebAppData(botToken, initData);
  }

  static async extractUserFromInitData(params: { initData: string }): Promise<User | null> {
    const { initData } = params;

    const telegramUserId = this.telegramAuthService.parseUserId(initData);

    const user = await User.findBy('tgId', telegramUserId);

    return user;
  }
}
