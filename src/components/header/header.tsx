import React, { FunctionComponent } from 'react';
import { Box, Image, Container, Stack, StackDivider } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import ConnectButton from '@/components/ton-connect/connect-button';
import HeaderMenu from '@/components/header/menu';

type HeaderProps = {
    children?: React.ReactNode;
};

const Header: FunctionComponent<HeaderProps> = ({ children }) => {
    return (
        <Box bgGradient="linear(to-r, #1E2531 70%, #2F93E8)">
            <Container
                as={Stack}
                maxW={'7xl'}
                py={2}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <Link href="/">
                    <Image
                        src="/ton-vault-avatar-icon-with-text-alt.svg"
                        fit="contain"
                        alt="Ton Vault Logo"
                    />
                </Link>
                <Stack
                    direction={'row'}
                    spacing={6}
                    divider={<StackDivider borderColor="gray.200" />}
                >
                    <HeaderMenu />
                    <ConnectButton />
                </Stack>
            </Container>
            {children}
        </Box>
    );
};

export default Header;
