import React, { ReactElement } from 'react';
import { IconType } from 'react-icons';
import { Link, VisuallyHidden } from '@chakra-ui/react';
import NextLink from 'next/link';

export type SocialLinkProps = {
    label: string;
    href: string;
    children: ReactElement<IconType | string>;
};

const SocialLink = ({ label, href, children }: SocialLinkProps) => {
    return (
        <Link as={NextLink} href={href} isExternal>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </Link>
    );
};

export default SocialLink;
