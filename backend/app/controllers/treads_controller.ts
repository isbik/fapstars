import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations';

import League from '#models/league';
import Tread from '#models/tread';
import { getByIdParamsValidator } from '#validators/common';
import { createTreadValidator, updateTreadValidator, searchTreadValidator } from '#validators/treads';

@inject()
export default class TreadsController {
  /**
   * @index
   * @operationId getTreads
   * @description Returns a paginated list of treads
   * @paramQuery page - The page number - @type(number) @optional
   * @paramQuery perPage - Number of items per page - @type(number) @optional @minimum(1) @maximum(100)
   * @responseBody 200 - <Tread[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async index({ request }: HttpContext) {
    const { page = 1, perPage = 10 } = request.qs();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Tread.query().paginate(page, perPage);
  }

  /**
   * @store
   * @operationId createTread
   * @description Creates a new tread
   * @requestBody <createTreadValidator>
   * @responseBody 201 - <Tread>
   * @responseBody 400 - Bad request
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTreadValidator);
    const tread = await Tread.create({
      ...payload,
      ownerId: request.user.id,
    });
    return response.created(tread);
  }

  /**
   * @show
   * @operationId getTread
   * @description Retrieves a tread by ID
   * @paramPath id - The ID of the tread to retrieve - @type(number) @required
   * @responseBody 200 - <Tread>
   * @responseBody 404 - Tread not found
   */
  async show({ params }: HttpContext) {
    await getByIdParamsValidator.validate(params);

    return Tread.findOrFail(params.id);
  }

  /**
   * @update
   * @operationId updateTread
   * @description Updates an existing tread
   * @paramPath id - The ID of the tread to update - @type(number) @required
   * @requestBody <updateTreadValidator>
   * @responseBody 200 - <Tread>
   * @responseBody 403 - Forbidden
   * @responseBody 404 - Tread not found
   */
  async update({ params, request, response }: HttpContext) {
    await getByIdParamsValidator.validate(params);
    const tread = await Tread.findOrFail(params.id);

    if (request.user.id != tread.ownerId) {
      return response.forbidden('You are not authorized to update this tread');
    }

    const payload = await request.validateUsing(updateTreadValidator);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await tread.merge(payload).save();

    return tread;
  }

  /**
   * @destroy
   * @operationId deleteTread
   * @description Deletes a specific tread
   * @paramPath id - The ID of the tread to delete - @type(number) @required
   * @responseBody 204 - No content
   * @responseBody 403 - Forbidden
   * @responseBody 404 - Tread not found
   */
  async destroy({ params, request, response }: HttpContext) {
    await getByIdParamsValidator.validate(params);
    const tread = await Tread.findOrFail(params.id);

    if (request.user.id != tread.ownerId) {
      const league = await League.find(tread.leagueId);
      if (league && request.user.id != league?.ownerId) {
        return response.forbidden('You are not authorized to delete this tread');
      }
    }

    await tread.delete();

    return response.noContent();
  }

  /**
   * @search
   * @operationId searchTreads
   * @description Searches for treads based on various filters
   * @requestBody <searchTreadValidator>
   * @responseBody 200 - <Tread[]>.paginated(data, meta)
   * @responseBody 400 - Bad request
   */
  async search({ request }: HttpContext) {
    const { filter, sort, pagination, include = [] } = await request.validateUsing(searchTreadValidator);

    const treads = Tread.filter(filter || {});

    if (sort) {
      // TODO: Implement sorting logic
    }

    for (const item of include) {
      await treads.preload(item as ExtractModelRelations<Tread>);
    }

    return treads.paginate(pagination?.page ?? 1, pagination?.perPage ?? 10);
  }
}
