import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import queue from '@rlanz/bull-queue/services/main';
import { DateTime } from 'luxon';

import ReferralAwardJob from '../jobs/referral_award_job.js';
import { isNumeric } from '../lib/is_numeric.js';

import League from '#models/league';
import User from '#models/user';
import FileUploadService from '#services/file_upload_service';
import { getUserAvatar } from '#services/telegram_user_avatar';
import { getByIdParamsValidator, paginationValidator } from '#validators/common';
import { queryPaginationValidator } from '#validators/pagination';
import { registerUserValidator, searchUserValidator, syncUserValidator, updateUserValidator } from '#validators/users';

// TODO: Вынести тело в сервисный слой
export default class UsersController {
  /**
   * @index
   * @operationId getUsers
   * @description Returns a paginated list of users
   * @paramQuery page - The page number - @type(number) @optional
   * @paramQuery perPage - Number of items per page - @type(number) @optional @minimum(1) @maximum(100)
   * @responseBody 200 - <User[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async index({ request }: HttpContext) {
    await queryPaginationValidator.validate(request.qs());
    const { page = 1, pageSize = 10 } = request.qs();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return User.query().paginate(page, pageSize);
  }

  /**
   * @register
   * @operationId registerUser
   * @description Registers a new user
   * @requestBody <registerUserValidator>
   * @requestHeader X-Token - The token for user authentication - @type(string) @required
   * @responseBody 201 - <User>
   * @responseBody 400 - Token not provided or invalid input
   */
  @inject()
  async register({ request }: HttpContext, fileUploadService: FileUploadService) {
    const payload = await request.validateUsing(registerUserValidator);

    let referrerUser: User | null = null;

    if (payload.referrer) {
      const isTgId = isNumeric(payload.referrer);

      if (isTgId) {
        referrerUser = await User.findBy('tgId', payload.referrer);
      } else {
        referrerUser = await User.findBy('username', payload.referrer);
      }

      if (referrerUser) {
        await queue.dispatch(ReferralAwardJob, {
          referrerUsername: referrerUser?.username,
          referralHasPremium: payload?.hasPremium,
        });
      }
    }

    try {
      const tgLinkAvatar = await getUserAvatar(payload.tgId);
      if (tgLinkAvatar) {
        const avatar = await fileUploadService.uploadFileFromUrl(tgLinkAvatar);
        payload.avatar = avatar;
      }
    } catch (error) {
      logger.error(error);
    }

    const user = await User.create({
      ...payload,
      referrerId: referrerUser ? referrerUser?.id : null,
      leagueId: referrerUser ? referrerUser?.leagueId : null,
    });

    return user;
  }

  /**
   * @sync
   * @operationId syncUser
   * @description Sync user stamina and balance to prevent cheating
   * @requestBody <syncUserValidator>
   * @responseBody 200 - <User>
   * @responseBody 404 - User not found
   */
  async sync({ request, response }: HttpContext) {
    const payload = await request.validateUsing(syncUserValidator);

    const user = await User.findOrFail(request.user.id);

    if (payload.staminaSpend) {
      const data = DateTime.now()
        .diff(user.staminaSpendAt.plus({ seconds: payload.staminaSpend }))
        .as('seconds');

      if (data < 0) {
        return response.status(400).send({ message: "You can't spend more stamina than you have" });
      }

      const staminaSpendAt = DateTime.now().minus({ seconds: payload.staminaCount });

      await User.query().where({ id: user.id }).update({ staminaSpendAt });

      return { staminaSpendAt };
    }
  }

  /**
   * @update
   * @operationId updateUser
   * @description Updates an existing user
   * @paramPath id - The ID of the user to update - @type(number) @required
   * @requestBody <updateUserValidator>
   * @responseBody 200 - <User>
   * @responseBody 404 - User not found
   */
  async update({ request, response, params }: HttpContext) {
    await getByIdParamsValidator.validate(params);
    if (params.id !== request.user.id) {
      return response.status(403).send("You can't edit another user's info");
    }
    const payload = await request.validateUsing(updateUserValidator);
    const user = await User.findOrFail(params.id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.merge(payload).save();

    return user;
  }

  /**
   * @show
   * @operationId getUser
   * @description Retrieves a user by ID
   * @paramPath id - The ID of the user to retrieve - @type(number) @required
   * @responseBody 200 - <User>
   * @responseBody 404 - User not found
   */
  async show({ params }: HttpContext) {
    await getByIdParamsValidator.validate(params);

    const user = await User.findOrFail(params.id);
    await user.load('league');

    return user;
  }

  /**
   * @me
   * @operationId me
   * @description Retrieves the current user
   * @responseBody 200 - <User>
   * @responseBody 404 - User not found
   */
  async me({ request }: HttpContext) {
    const user = await User.findOrFail(request.user.id);

    await user.preload('league');

    return user;
  }

  /**
   * @search
   * @operationId searchUsers
   * @description Searches for users based on various filters
   * @requestBody <searchUserValidator>
   * @responseBody 200 - <User[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async search({ request }: HttpContext) {
    const { filter, sort, pagination, include = [] } = await request.validateUsing(searchUserValidator);

    const users = User.filter(filter || {}).orderBy('balance', 'desc');

    if (sort) {
      // TODO: Прописать сортировку
    }

    for (const item of include) {
      await users.preload(item as ExtractModelRelations<User>);
    }

    return users.paginate(pagination?.page ?? 1, pagination?.perPage ?? 10);
  }

  async referrals({ request, params }: HttpContext) {
    const { id } = await getByIdParamsValidator.validate(params);
    const { limit } = await request.validateUsing(paginationValidator);

    const referrals = await User.query().where('referrerId', id).orderBy('balance', 'desc');

    const referralsIds = referrals.map(ref => ref.id);
    const modelsCount = (await League.query().whereIn('ownerId', referralsIds)).length;

    const count = referrals.length;

    const totalBalance = referrals.reduce((acc, user) => {
      return acc + parseInt(user.balance);
    }, 0);

    const sorted = referrals.toSorted((a, b) => {
      return Number.parseInt(b.balance) - Number.parseInt(a.balance);
    });

    return {
      data: {
        referrals: sorted.slice(0, limit),
        count,
        modelsCount,
        totalBalance,
      },
    };
  }

  async invited_models({ request, params }: HttpContext) {
    const { id } = await getByIdParamsValidator.validate(params);
    const { limit } = await request.validateUsing(paginationValidator);

    const models = await League.query()
      .whereIn('owner_id', function (builder) {
        return builder.select('id').from('users').where('referrer_id', id);
      })
      .orderBy('balance', 'desc')
      .limit(limit);

    return {
      data: {
        models,
        count: models.length,
      },
    };
  }
}
