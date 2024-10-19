import { inject } from '@adonisjs/core';
import { MultipartFile } from '@adonisjs/core/bodyparser';
import { cuid } from '@adonisjs/core/helpers';
import { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import drive from '@adonisjs/drive/services/main';

import env from '#start/env';

@inject()
export default class FileUploadService {
  protected extnames: string[];

  constructor(protected ctx: HttpContext) {
    const availableExtnames = env.get('S3_EXT_NAMES').split(',');
    this.extnames = [...availableExtnames, ...availableExtnames.map(x => x.toUpperCase())];
  }

  public async upload(image: MultipartFile, filename?: string): Promise<string> {
    if (!image.extname) {
      logger.error('Missed file extension', image.fileName);
      throw new Error(`Missed file extension ${image.fileName}`);
    }

    try {
      const fn = filename ?? this.makeUniqueFileName(image.extname);
      await image.moveToDisk(fn, { visibility: 'public' });
      return await drive.use().getUrl(fn);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async uploadFileFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const fileBuffer = await response.arrayBuffer();

      const fileName = `file-${Date.now()}-${cuid()}.${this.getExtension(url)}`;

      await drive.use().put(fileName, Buffer.from(fileBuffer), {
        visibility: 'public',
        contentType: response.headers.get('content-type') ?? undefined,
      });

      return await drive.use().getUrl(fileName);
    } catch (error) {
      logger.error('File upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  protected getExtension(url: string): string {
    return url.split('.').pop() || '';
  }

  protected makeUniqueFileName(extension: string) {
    return `user-${this.ctx.request.user.id}_${Date.now()}-${cuid()}.${extension}`;
  }
}
