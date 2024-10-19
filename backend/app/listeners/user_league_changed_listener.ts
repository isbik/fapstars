import UserLeagueChangedEvent from '#events/user_league_changed_event';
import League from '#models/league';
import TransactionsService from '#services/transactions_service';
import { inject } from '@adonisjs/core';

@inject()
export default class UserLeagueChangedListener {
  constructor(protected transactionsService: TransactionsService) {}

  async handle(event: UserLeagueChangedEvent) {
    const { user, type, leagueId } = event;
    const league = await League.findByOrFail('id', leagueId);

    switch (type) {
      case 'ENTER':
        league.balance = (BigInt(league.balance) + BigInt(user.balance)).toString();
        await league.save();
        break;
      case 'EXIT':
        if ((user.balancedAt ?? 0) < (league.balancedAt ?? 0)) {
          league.balance = (BigInt(league.balance) - BigInt(user.balance)).toString();
          await league.save();
        } else {
          const holdedBalance = await this.transactionsService.countUserTotal(user.id, user.balancedAt ?? undefined);
          league.balance = (BigInt(league.balance) - (BigInt(user.balance) + BigInt(holdedBalance))).toString();
          await league.save();
          /**
           * TODO: может возникнуть ситуация, что часть баланса пользователя ещё не была записана в баланс лиги
           * тогда надо проверить user.balancedAt и league.balancedAt.
           * Если user.balancedAt <= league.balancedAt => в лиге целиком весь баланс пользователя
           * иначе есть разница, храняшаяся в редисе.
           * В последнем случе эту разницу надо рассчиать с помощью TransactionsService.countUserTotal
           * и вычесть из баланса лиги.
           * P.S. вычитаем из баланса, а не из кеша чтобы избежать гонки, хотя в любом случае оно будет работать.
           * P.P.S. также надо обработать случай, что у кого-то вообще нет поля balancedAT
           */
        }
        break;
    }
  }
}
