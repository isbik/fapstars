import { cuid } from '@adonisjs/core/helpers';
import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import drive from '@adonisjs/drive/services/main';

import env from '#start/env';

export default class UploadsController {
  public async upload({ request, response }: HttpContext) {
    try {
      const extnames = env.get('S3_EXT_NAMES').split(',');
      const extnamesWithUpper = [...extnames, ...extnames.map(x => x.toUpperCase())];

      const image = request.file('image', {
        extnames: extnamesWithUpper,
        size: '2mb',
      });

      if (!image) {
        return response.badRequest('No image file found');
      }
      if (!image.isValid) {
        return response.badRequest('Image is invalid. ' + image.errors.map(e => e.message).join('. '));
      }
      const fileName = `user-${request.user.id}_${Date.now()}-${cuid()}.${image.extname}`;
      await image.moveToDisk(fileName, { visibility: 'public' });
      const imageUrl = await drive.use().getUrl(fileName);

      return response.ok({ url: imageUrl });
    } catch (error) {
      logger.error(error);
      return response.internalServerError('Error uploading image');
    }
  }
}
