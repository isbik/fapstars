import vine from '@vinejs/vine';

export const getByIdParamsValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  }),
);

export const getByUuidParamsValidator = vine.compile(
  vine.object({
    id: vine.string(),
  }),
);

export const paginationValidator = vine.compile(
  vine.object({
    limit: vine
      .number()
      .max(100)
      .optional()
      .transform(v => v || 10),
  }),
);
