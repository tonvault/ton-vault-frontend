'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

type ChakraProvidersProps = {
    children: React.ReactNode;
    theme: any;
};

export function ChakraProviders({ children, theme }: ChakraProvidersProps) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </CacheProvider>
    );
}
