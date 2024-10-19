import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useState } from 'react';

import { User } from '~/entities/user/types';

type UserState = User | null | undefined;

interface AuthContext {
  user: UserState;
  setUser: Dispatch<SetStateAction<UserState>>;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserState>();

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
