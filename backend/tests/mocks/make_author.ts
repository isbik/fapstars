import { LeagueFactory } from '#database/factories/league_factory';
import { UserFactory } from '#database/factories/user_factory';

const makeAuthor = async () => {
  const author = await UserFactory.apply('new').create();
  const league = await LeagueFactory.merge({ ownerId: author.id }).create();
  await author.merge({ leagueId: league.id.toString() }).save();

  return {
    author,
    league,
  };
};

export default makeAuthor;
