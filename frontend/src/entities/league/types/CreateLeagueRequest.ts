interface CreateLeagueRequest {
  ownerId: string;
  name: string;
  avatar?: string | null;
  socialLink?: string;
  isAiModel?: boolean;
  isVerified?: boolean;
  countryCode?: string | null;
}

export default CreateLeagueRequest;
