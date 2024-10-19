interface CreateUserAccountRequest {
  tgId: string;
  username: string;
  hasPremium: boolean;
  referrer: string | null;
  avatar: string | null;
}

export default CreateUserAccountRequest;
