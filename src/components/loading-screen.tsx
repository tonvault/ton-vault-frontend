import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';
import { observer } from 'mobx-react-lite';

type LoadingScreenProps = {
    children?: React.ReactNode;
};

const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({ children }) => {
    const { userState } = useUserContext();
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLoading(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (userState.fetchingData) {
            timeoutRef.current = setTimeout(() => {
                setLoading(true);
            }, 700);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setLoading(false);
        };
    }, [userState.fetchingData]);

    return loading ? (
        <>
            <>{children}</>
            <Center
                position="fixed"
                top="0"
                right="0"
                bottom="0"
                left="0"
                bg="rgba(255,255,255,0.7)"
            >
                <Spinner
                    size="xl"
                    speed="0.65s"
                    thickness="4px"
                    emptyColor="gray.200"
                    color="blue.500"
                />
            </Center>
        </>
    ) : (
        <>{children}</>
    );
};

export default observer(LoadingScreen);
