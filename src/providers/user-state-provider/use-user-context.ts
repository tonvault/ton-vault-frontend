'use client';

import { createContext, useContext } from 'react';
import userState from '@/store/user-state';

type UserContextType = {
    userState: typeof userState;
};

export const UserContext = createContext<UserContextType>({
    userState,
});

export const useUserContext = () => useContext(UserContext);
