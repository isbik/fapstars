import crypto from 'crypto';

export default class TelegramAuthService {
  public verifyTelegramWebAppData(botToken: string, telegramInitData: string): boolean {
    const initData = new URLSearchParams(telegramInitData);

    initData.sort();

    const hash = initData.get('hash');
    initData.delete('hash');

    const dataToCheck = [...initData.entries()].map(([key, value]) => key + '=' + value).join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const _hash = crypto.createHmac('sha256', secretKey).update(dataToCheck).digest('hex');

    return hash === _hash;
  }

  public parseUserId(queryString: string): number | null {
    const userIdMatch = queryString.match(/%22id%22%3A(\d+)/);

    if (userIdMatch) {
      const userId = userIdMatch[1];
      return parseInt(userId);
    }

    return null;
  }

  public parseHash(queryString: string): string | null {
    const hashMatch = queryString.match(/hash=([a-f0-9]{64})/);

    if (hashMatch) {
      const hash = hashMatch[1];
      return hash;
    }

    return null;
  }
}
