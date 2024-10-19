import vine from '@vinejs/vine';

import { pagination } from './pagination.js';

export const createLeagueValidator = vine.compile(
  vine.object({
    ownerId: vine.string(),
    name: vine.string(),
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
    socialLink: vine.string().optional(),
    isAiModel: vine.boolean().optional(),
    isVerified: vine.boolean().optional(),
    countryCode: vine.string().optional(),
  }),
);

export const searchLeagueValidator = vine.compile(
  vine.object({
    filter: vine
      .object({
        name: vine.string().trim().optional(),
      })
      .optional(),
    sort: vine.object({}).optional(),
    orderBy: vine
      .object({
        column: vine.enum(['created_at', 'balance']),
        direction: vine.enum(['asc', 'desc']),
      })
      .optional(),
    pagination,
  }),
);

export const updateLeagueValidator = vine.compile(
  vine.object({
    ownerId: vine.string().optional(),
    name: vine.string().optional(),
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
    balance: vine.string().optional(),
    socialLink: vine.string().optional(),
    isAiModel: vine.boolean().optional(),
    isVerified: vine.boolean().optional(),
    countryCode: vine.string().optional().nullable(),
  }),
);
