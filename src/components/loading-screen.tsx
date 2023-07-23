import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

const LoadingScreen = () => {
    return (
        <Center position="fixed" top="0" right="0" bottom="0" left="0" bg="rgba(255,255,255,0.7)">
            <Spinner
                size="xl"
                speed="0.65s"
                thickness="4px"
                emptyColor="gray.200"
                color="blue.500"
            />
        </Center>
    );
};

export default LoadingScreen;
