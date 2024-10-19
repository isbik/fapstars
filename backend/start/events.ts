import emitter from '@adonisjs/core/services/emitter';

import UserLeagueChangedEvent from '#events/user_league_changed_event';

const UserLeagueChangedListener = () => import('#listeners/user_league_changed_listener');

emitter.on(UserLeagueChangedEvent, [UserLeagueChangedListener]);
