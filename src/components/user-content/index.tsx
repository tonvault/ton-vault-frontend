import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';
import NotAuthorized from '@/components/user-content/not-authorized';
import Authorized from '@/components/user-content/authorized';
import { ToastId, useToast } from '@chakra-ui/react';
import LoadingScreen from '@/components/loading-screen';

const UserContent = () => {
    const { userState } = useUserContext();
    const toast = useToast();
    const toastIdRef = useRef<ToastId>();
    const [contentFetched, setContentFetched] = useState(false);
    useEffect(() => {
        const obtainData = async () => {
            try {
                userState.fetchingData = true;
                await userState.obtainLastEncryptedContent();
                setContentFetched(true);
            } catch (e) {
                const err: any = e;
                toastIdRef.current = toast({
                    description: err?.message || 'Request rejected!',
                    position: 'top-left',
                    status: 'error',
                    duration: 3000,
                });
            } finally {
                userState.fetchingData = false;
            }
        };
        if (userState.isAuthorized) {
            obtainData();
        }
    }, [userState.isAuthorized, userState.encryptedContent]);

    return userState.isAuthorized && contentFetched ? (
        <Authorized />
    ) : (
        <LoadingScreen>
            <NotAuthorized />
        </LoadingScreen>
    );
};

export default observer(UserContent);
