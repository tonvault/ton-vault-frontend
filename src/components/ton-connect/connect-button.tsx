import React, { FunctionComponent } from 'react';
import useTonConnectContext from '@/providers/ton-connect-provider/use-ton-connect-context';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import ConnectedMenu from '@/components/ton-connect/connected-menu';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';
import { observer } from 'mobx-react-lite';
import { Address } from 'ton';
import TonConnectModal from '@/components/ton-connect/ton-connect-modal';

const ConnectButton: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {
        userState: { wallet },
    } = useUserContext();
    const { connectionRestored, tonConnect } = useTonConnectContext();
    return (
        <Box>
            {wallet ? (
                <ConnectedMenu
                    address={Address.parse(wallet.account.address).toString()}
                    tonConnect={tonConnect}
                />
            ) : (
                <Button colorScheme="gray" isLoading={!connectionRestored} onClick={onOpen}>
                    Sign in
                </Button>
            )}
            <TonConnectModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default observer(ConnectButton);
