/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useContext } from 'react';

import { AuthContext } from './AuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
