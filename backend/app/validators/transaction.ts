import vine from '@vinejs/vine';

const TAP_LIMIT = 2500; // Кол-во физически возможных кликов по экрану

export const createTransactionValidator = vine.compile(
  vine.object({
    cnt: vine.number().min(1).max(TAP_LIMIT),
    type: vine.enum(['item', 'tap', 'task', 'invite', 'extra']),
  }),
);
