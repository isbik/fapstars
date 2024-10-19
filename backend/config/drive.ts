import app from '@adonisjs/core/services/app';
import { defineConfig, services } from '@adonisjs/drive';
import { S3Client } from '@aws-sdk/client-s3';

import env from '#start/env';

const bucket = env.get('S3_BUCKET');
const endpoint = env.get('S3_ENDPOINT');
const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: env.get('AWS_REGION'),
      bucket: bucket,
      endpoint: endpoint,
      visibility: 'public',
      useGlobalEndpoint: true,
      urlBuilder: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        generateURL(key: string, bucket: string, _: S3Client): Promise<string> {
          // Добавить поддомен с названием бакета в публичную ссылку. Drive кажется в это не умеет
          return Promise.resolve(endpoint.replace('://', `://${bucket}.`) + '/' + key);
        },
      },
    }),
  },
});

export default driveConfig;

declare module '@adonisjs/drive/types' {
  // eslint-disable-next-line no-undef
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
