'use client';

import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { Box } from '@chakra-ui/react';
import React from 'react';
import Index from '@/app/index';
import UserContent from '../components/user-content';

export default function Page() {
    return (
        <Index>
            <Box className="page-container">
                <Header />
                <Box className="content-wrapper">
                    <UserContent />
                </Box>
                <Footer />
            </Box>
        </Index>
    );
}
