import vine from '@vinejs/vine';

export const createTreadValidator = vine.compile(
  vine.object({
    content: vine.string().trim().nullable(),
    leagueId: vine.string().trim(),
  }),
);

export const searchTreadValidator = vine.compile(
  vine.object({
    filter: vine
      .object({
        leagueId: vine.string().trim().optional(),
        ownerId: vine.string().trim().optional(),
        content: vine.string().trim().optional(),
        ownerUsername: vine.string().trim().optional(),
        leagueName: vine.string().trim().optional(),
      })
      .optional(),
    sort: vine.object({}).optional(),
    include: vine.array(vine.string()).optional(),
    pagination: vine
      .object({
        page: vine.number().min(1),
        perPage: vine.number().min(1).max(100),
      })
      .optional(),
  }),
);

export const updateTreadValidator = vine.compile(
  vine.object({
    content: vine.string().trim().nullable(),
  }),
);
