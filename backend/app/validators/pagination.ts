import vine from '@vinejs/vine';

export const pagination = vine
  .object({
    page: vine.number().min(1),
    perPage: vine.number().min(1).max(100),
  })
  .optional();

export const queryPaginationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  }),
);
