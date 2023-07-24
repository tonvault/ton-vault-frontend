'use client';

import { createContext, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ITonConnect, TonConnect } from '@tonconnect/sdk';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';
import { ToastId, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SecretKeeper } from '@/store/secret-keeper/secret-keeper';

export type TonConnectContextType = {
    tonConnect: ITonConnect | null;
    connectionRestored: boolean;
};

export const TonConnectContext = createContext<TonConnectContextType>({
    connectionRestored: false,
    tonConnect: null,
});

type TonConnectorProviderProps = {
    children: ReactNode;
    manifestUrl: string;
};

const TonConnectProvider = ({ manifestUrl, children }: TonConnectorProviderProps) => {
    const [didMount, setDidMount] = useState(false);
    const [connectionRestored, setConnectionRestored] = useState(false);
    const { userState } = useUserContext();
    const toast = useToast();
    const toastIdRef = useRef<ToastId>();
    useEffect(() => {
        setDidMount(true);
    }, []);

    const tonConnect = useMemo(() => {
        const connect = () => {
            return didMount
                ? new TonConnect({
                      manifestUrl,
                  })
                : null;
        };
        return connect();
    }, [didMount]);

    useEffect(() => {
        if (tonConnect) {
            tonConnect.restoreConnection().then(() => {
                setConnectionRestored(true);
            });
            tonConnect.onStatusChange(async (wallet) => {
                if (!wallet) {
                    return;
                }
                if (userState.isAuthorized) {
                    return;
                }
                const jwt = SecretKeeper.getJwt();
                if (jwt && !SecretKeeper.checkJwt(jwt)) {
                    return userState.signOut(tonConnect);
                }
                try {
                    userState.fetchingData = true;
                    await userState.signIn(wallet);
                } catch (e) {
                    const err: any = e;
                    toastIdRef.current = toast({
                        description: err?.message || 'Request rejected!',
                        position: 'top-left',
                        status: 'error',
                        duration: 3000,
                    });
                    await userState.signOut(tonConnect);
                } finally {
                    userState.fetchingData = false;
                }
            });
        }
    }, [tonConnect]);

    return (
        <TonConnectContext.Provider
            value={{
                tonConnect,
                connectionRestored,
            }}
        >
            {children}
        </TonConnectContext.Provider>
    );
};

export default observer(TonConnectProvider);
