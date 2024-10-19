import { enc, HmacSHA256 } from 'crypto-js';

export const calculateSecretSignature = (data: string, secret: string): string =>
  HmacSHA256(data, secret).toString(enc.Hex);
