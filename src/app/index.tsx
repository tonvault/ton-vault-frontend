'use client';

import React, { FunctionComponent } from 'react';
import TonConnectProvider from '@/providers/ton-connect-provider';
import { Env } from '@/services/env/env';
import { ChakraProviders } from '@/providers/chakra-provider/chakra-providers';
import UserStateProvider from '@/providers/user-state-provider/user-state-provider';
import { extendTheme } from '@chakra-ui/react';

type IndexProps = {
    children: React.ReactNode;
};

const theme = extendTheme({
    styles: {
        global: () => ({
            body: {
                background: '',
            },
        }),
    },
});

const Index: FunctionComponent<IndexProps> = ({ children }) => {
    return (
        <UserStateProvider>
            <TonConnectProvider manifestUrl={Env.tonConnectManifestUrl}>
                <ChakraProviders theme={theme}>{children}</ChakraProviders>
            </TonConnectProvider>
        </UserStateProvider>
    );
};

export default Index;
