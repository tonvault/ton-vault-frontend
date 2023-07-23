import React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import SocialLink from '@/components/social-link';
import { Links } from '@/constant/links';

const HeaderMenu = () => {
    return (
        <HStack justify={'flex-end'}>
            <SocialLink label="Docs" href={Links.DOCS}>
                <Text fontWeight="bold" textDecoration="underline" color="#f7f9fb">
                    Docs
                </Text>
            </SocialLink>
        </HStack>
    );
};

export default HeaderMenu;
