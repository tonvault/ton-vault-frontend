'use client';

import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { Box } from '@chakra-ui/react';
import React from 'react';
import Index from '@/app/index';
import UserContent from '../components/user-content';
import LoadingScreen from '@/components/loading-screen';

export default function Page() {
    return (
        <Index>
            <Box className="page-container">
                <Header />
                <LoadingScreen>
                    <Box className="content-wrapper">
                        <UserContent />
                    </Box>
                </LoadingScreen>
                <Footer />
            </Box>
        </Index>
    );
}
