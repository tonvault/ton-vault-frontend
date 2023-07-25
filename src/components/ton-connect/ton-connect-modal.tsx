'use client';

import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/modal';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { isWalletInfoCurrentlyInjected, WalletInfo } from '@tonconnect/sdk';
import useTonConnectContext from '@/providers/ton-connect-provider/use-ton-connect-context';
import { Button, Flex, Image, ToastId, useToast } from '@chakra-ui/react';
import isCompatibleWallet from '@/utils/is-compatible-wallet';
import { CompatibleWalletNames } from '@/constant/compatible-wallets';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';
import { observer } from 'mobx-react-lite';
import { TonVaultApi } from '@/services/ton-vault-api/ton-vault-api';

type TonConnectModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const TonConnectModal: FunctionComponent<TonConnectModalProps> = ({ isOpen, onClose }) => {
    const { tonConnect } = useTonConnectContext();
    const [walletsList, setWalletsList] = useState<WalletInfo[] | null>([]);
    const toast = useToast();
    const toastIdRef = useRef<ToastId>();
    const { userState } = useUserContext();

    useEffect(() => {
        if (userState.wallet && isOpen) {
            onClose();
        }
    }, [userState.wallet]);

    useEffect(() => {
        const fetchWallets = async () => {
            if (tonConnect) {
                try {
                    userState.fetchingData = true;
                    const wallets = await tonConnect.getWallets();
                    setWalletsList(
                        wallets.filter((wallet) =>
                            isCompatibleWallet(wallet.name as CompatibleWalletNames),
                        ),
                    );
                } catch (e) {
                    console.error(e);
                } finally {
                    userState.fetchingData = false;
                }
            }
        };
        fetchWallets();
    }, [tonConnect]);

    const onWalletClick = async (walletInfo: WalletInfo): Promise<any> => {
        if (isWalletInfoCurrentlyInjected(walletInfo) && !userState.wallet) {
            try {
                userState.fetchingData = true;
                const { result } = await TonVaultApi.getAuthPayload();
                tonConnect?.connect(
                    {
                        jsBridgeKey: walletInfo.jsBridgeKey,
                    },
                    result,
                );
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
        } else {
            window.open(walletInfo.aboutUrl, '_blank');
        }
    };

    const button = (wallet: WalletInfo) => {
        return (
            <Button
                leftIcon={<Image src={wallet.imageUrl} alt="no image" w="20px" h="20px" />}
                mx={1}
                key={wallet.name}
                onClick={() => onWalletClick(wallet)}
                isLoading={userState.fetchingData}
            >
                {wallet.name}
            </Button>
        );
    };

    return (
        <>
            <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!!walletsList && (
                            <Flex>{walletsList.map((wallet) => button(wallet))}</Flex>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default observer(TonConnectModal);
