import vine from '@vinejs/vine';

import { pagination } from './pagination.js';

export const getUserByQueryValidator = vine.compile(
  vine.object({
    id: vine.string().optional(),
    tgId: vine.string().optional(),
  }),
);

export const registerUserValidator = vine.compile(
  vine.object({
    tgId: vine.string().trim(),
    username: vine.string().trim(),
    referrer: vine.string().trim().optional().nullable(),
    hasPremium: vine.boolean(),
    avatar: vine.string().trim().nullable(),
  }),
);

export const searchUserValidator = vine.compile(
  vine.object({
    filter: vine
      .object({
        id: vine.string().optional(),
        tgId: vine.string().optional(),
        leagueId: vine.string().optional(),
        username: vine.string().trim().optional(),
        usernameLike: vine.string().trim().optional(),
        hasPremium: vine.boolean().optional(),
        referrerId: vine.string().optional(),
        referrerName: vine.string().trim().optional(),
        referrerNameLike: vine.string().trim().optional(),
      })
      .optional(),
    sort: vine.object({}).optional(),
    include: vine.array(vine.string()).optional(), // TODO: сократить до релейшенов модели
    pagination,
  }),
);

export const syncUserValidator = vine.compile(
  vine.object({
    balance: vine.string().trim().optional(),
    staminaCount: vine.number().min(0).optional(),
    staminaSpend: vine.number().min(0).optional(),
  }),
);

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().optional(),
    hasPremium: vine.boolean().optional(),
    avatar: vine.string().trim().nullable().optional(),
  }),
);
