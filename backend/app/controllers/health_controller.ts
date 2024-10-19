import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import drive from '@adonisjs/drive/services/main';
import Db from '@adonisjs/lucid/services/db';

export default class HealthController {
  public async s3({ response }: HttpContext) {
    try {
      const exists = await drive.use('s3').exists('ping.txt');
      if (exists == null) {
        const message = 'Unable to verify S3 connection';
        logger.error(message);
        return response.status(500).json({ health: 'error', message });
      }

      logger.info(exists);
      return response.ok({ health: 'ok', message: 'S3 connection is healthy' });
    } catch (error) {
      const message = 'S3 connection failed with error';
      logger.error(message);
      logger.error(error);
      return response.status(500).json({ health: 'error', message: message });
    }
  }

  public async db({ response }: HttpContext) {
    try {
      await Db.rawQuery('SELECT 1+1 as res');
      return response.status(200).json({ success: true, message: 'DB is healthy' });
    } catch (error) {
      logger.error(error);
      return response.status(500).json({ success: false, message: 'Failed to connect to the database' });
    }
  }
}
