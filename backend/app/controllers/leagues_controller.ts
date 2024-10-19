import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

import UserLeagueChangedEvent from '#events/user_league_changed_event';
import League from '#models/league';
import FileUploadService from '#services/file_upload_service';
import { getByIdParamsValidator } from '#validators/common';
import { createLeagueValidator, searchLeagueValidator, updateLeagueValidator } from '#validators/leagues';
import { queryPaginationValidator } from '#validators/pagination';

export default class LeaguesController {
  /**
   * @index
   * @operationId getLeagues
   * @description Returns a paginated list of leagues
   * @paramQuery page - The page number - @type(number) @optional
   * @paramQuery pageSize - Number of items per page - @type(number) @optional @minimum(1) @maximum(100)
   * @responseBody 200 - <League[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async index({ request }: HttpContext) {
    await queryPaginationValidator.validate(request.qs());
    const { page = 1, pageSize = 10 } = request.qs();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return League.query().paginate(page, pageSize);
  }

  /**
   * @store
   * @operationId createLeague
   * @description Creates a new league
   * @requestBody <createLeagueValidator>
   * @responseBody 201 - <League>
   * @responseBody 400 - Bad request
   */
  @inject()
  async store({ request, response }: HttpContext, fileUploadService: FileUploadService) {
    if (request.user.leagueId) {
      return response.badRequest('You already have league');
    }
    const payload = await request.validateUsing(createLeagueValidator);

    let avatarLink = null;
    if (payload.avatar) {
      try {
        avatarLink = await fileUploadService.upload(payload.avatar);
      } catch (error) {
        return response.internalServerError('Error uploading image');
      }
    }

    const league = await League.create({ ...payload, avatar: avatarLink });
    await request.user.merge({ leagueId: league.id }).save();

    return league;
  }

  /**
   * @show
   * @operationId getLeague
   * @description Retrieves a league by ID
   * @paramPath id - The ID of the league to retrieve - @type(number) @required
   * @responseBody 200 - <League>
   * @responseBody 404 - League not found
   */
  async show({ params }: HttpContext) {
    await getByIdParamsValidator.validate(params);

    const league = await League.query().withCount('members').where('id', params.id).firstOrFail();
    return {
      ...league.toJSON(),
      members_count: parseInt(league.$extras.members_count),
    };
  }

  /**
   * @update
   * @operationId updateLeague
   * @description Updates an existing league
   * @paramPath id - The ID of the league to update - @type(number) @required
   * @requestBody <updateLeagueValidator>
   * @responseBody 200 - <League>
   * @responseBody 404 - League not found
   */
  @inject()
  async update({ params, request, response }: HttpContext, fileUploadService: FileUploadService) {
    await getByIdParamsValidator.validate(params);
    const payload = await request.validateUsing(updateLeagueValidator);
    const league = await League.findOrFail(params.id);
    if (request.user.id !== league.ownerId) {
      return response.status(403).send("It's not your league");
    }

    let avatarLink = null;
    if (payload.avatar) {
      try {
        avatarLink = await fileUploadService.upload(payload.avatar);
      } catch (error) {
        return response.internalServerError('Error uploading image');
      }
    }

    await league
      .merge({
        ...payload,
        avatar: avatarLink ?? league.avatar,
      })
      .save();

    return league;
  }

  /**
   * @destroy
   * @operationId deleteLeague
   * @description Deletes a league by ID
   * @paramPath id - The ID of the league to delete - @type(number) @required
   * @responseBody 204 - No Content
   * @responseBody 404 - League not found
   */
  async destroy({ params, request, response }: HttpContext) {
    await getByIdParamsValidator.validate(params);
    const league = await League.findOrFail(params.id);
    if (request.user.id !== league.ownerId) {
      return response.status(403).send("It's not your league");
    }
    await league.delete();

    return response.status(204);
  }

  /**
   * @search
   * @operationId searchLeagues
   * @description Search leagues by name
   * @paramQuery filter.name - The name of the league to search - @type(string) @optional
   * @paramQuery pagination.page - The page number - @type(number) @optional
   * @paramQuery pagination.perPage - Number of items per page - @type(number) @optional @minimum(1) @maximum(100)
   * @paramQuery orderBy.column - The column to sort by - @type(string) @optional
   * @paramQuery orderBy.direction - The direction to sort by - @type(string) @optional @enum(asc, desc)
   * @responseBody 200 - <League[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async search({ request }: HttpContext) {
    const { filter = {}, pagination, orderBy } = await request.validateUsing(searchLeagueValidator);

    const query = League.query().where(filter);

    if (orderBy) {
      query.orderBy(orderBy.column, orderBy.direction);
    }

    return query.paginate(pagination?.page ?? 1, pagination?.perPage ?? 10);
  }

  /**
   * @enter
   * @operationId enterLeague
   * @description Allows a user to enter a league
   * @paramPath id - The ID of the league to enter - @type(number) @required
   * @requestBody - The user object
   * @responseBody 200 - <User>
   * @responseBody 404 - League not found
   * @responseBody 400 - Bad request
   */
  async enter({ request, response, params }: HttpContext) {
    await getByIdParamsValidator.validate(params);
    const { user } = request;

    if (user.leagueId) {
      return response.status(400).send('You already have league');
    }

    await user
      .merge({
        leagueId: params.id,
      })
      .save();
    await user.preload('league');

    UserLeagueChangedEvent.dispatch(user, 'ENTER', params.id);

    return user;
  }

  /**
   * @exit
   * @operationId exitLeague
   * @description Allows a user to exit a league
   * @responseBody 200 - <User>
   * @responseBody 400 - Bad request
   */
  async exit({ request, response }: HttpContext) {
    const { user } = request;
    const oldLeagueId = user.leagueId;

    if (!oldLeagueId) return response.status(400).send("You already haven't league");

    user.leagueId = null;
    await user.save();

    UserLeagueChangedEvent.dispatch(user, 'EXIT', oldLeagueId);

    return user;
  }
}
