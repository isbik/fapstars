interface SearchUsersFilter {
  id?: string;
  tgId?: string;
  leagueId?: string;
  username?: string;
  usernameLike?: string;
  hasPremium?: boolean;
  referrerId?: string;
  referrerName?: string;
  referrerNameLike?: string;
}

export default SearchUsersFilter;
