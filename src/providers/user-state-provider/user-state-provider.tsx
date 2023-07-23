'use client';

import React, { FunctionComponent, ReactNode } from 'react';
import { UserContext } from '@/providers/user-state-provider/use-user-context';
import userState from '@/store/user-state';

export type UserStateProviderProps = {
    children: ReactNode;
};

const UserStateProvider: FunctionComponent<UserStateProviderProps> = ({ children }) => {
    return <UserContext.Provider value={{ userState }}>{children}</UserContext.Provider>;
};

export default UserStateProvider;
