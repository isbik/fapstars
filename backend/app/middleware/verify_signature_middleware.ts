import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

import { GlobalAuthentication } from '../modules/index.js';

import env from '#start/env';

export default class VerifySignatureMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const sigToken = request.header('X-Signature');

    if (!sigToken) {
      return response.status(400).send('Signature token not provided');
    }

    const verifyToken = env.get('SECRET_TOKEN');
    if (verifyToken === undefined) {
      return response.status(500).send('Internal Server Error: Verify user token not provided');
    }

    const isSignatureTokenVerified = GlobalAuthentication.verifySignatureToken({
      signatureToken: sigToken,
      secretToken: verifyToken,
      message: JSON.stringify(request.all()),
    });

    if (!isSignatureTokenVerified) {
      return response.status(401).send('Unauthorized: Token mismatch');
    }

    const output = await next();
    return output;
  }
}
