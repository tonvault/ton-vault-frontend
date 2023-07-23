import React, { FunctionComponent } from 'react';
import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaTelegramPlane, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';
import { Links } from '@/constant/links';
import SocialLink from '@/components/social-link';

const Footer: FunctionComponent = () => {
    const iconSize = 20;
    return (
        <Box
            bgGradient="linear(to-r, #282828 70%, #8b8b8b)"
            color={useColorModeValue('gray.200', 'gray.200')}
        >
            <Container
                as={Stack}
                maxW={'7xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <Text>© 2023 Ton Vault. All rights reserved</Text>
                <Stack direction={'row'} spacing={10}>
                    <SocialLink label={'Youtube'} href={Links.YOUTUBE}>
                        <FaYoutube size={iconSize} />
                    </SocialLink>
                    <SocialLink label={'Github'} href={Links.GITHUB}>
                        <FaGithub size={iconSize} />
                    </SocialLink>
                    <SocialLink label={'Twitter'} href={Links.TWITTER}>
                        <FaTwitter size={iconSize} />
                    </SocialLink>
                    <SocialLink label={'Telegram'} href={Links.TELEGRAM}>
                        <FaTelegramPlane size={iconSize} />
                    </SocialLink>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
