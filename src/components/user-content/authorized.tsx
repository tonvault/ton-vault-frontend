import React, { FunctionComponent, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, ToastId, useToast } from '@chakra-ui/react';
import {
    RawUserContentInterface,
    SecretInterface,
} from '@/store/secret-keeper/interface/raw-user-content.interface';
import EncryptedScene from '@/components/user-content/encrypted-scene';
import DecryptedScene from '@/components/user-content/decrypted-scene';
import { EncryptedContentDto } from '@/services/ton-vault-api/dto';
import { useUserContext } from '@/providers/user-state-provider/use-user-context';

export type LoadingState = {
    decrypting: boolean;
    updating: boolean;
};

const Authorized: FunctionComponent = () => {
    const [contentDecrypted, setContentDecrypted] = useState<boolean>(false);
    const [decryptedContent, setDecryptedContent] = useState<RawUserContentInterface>({
        secrets: [],
        lastUpdate: 0,
    });
    const [loading, setLoading] = useState<LoadingState>({
        decrypting: false,
        updating: false,
    });
    const toast = useToast();
    const toastIdRef = useRef<ToastId>();
    const { userState } = useUserContext();

    const decryptContent = async (encryptedContent: EncryptedContentDto) => {
        setLoading({ ...loading, decrypting: true });
        try {
            const content = await userState.secretKeeper?.decryptContent(encryptedContent);
            if (content) {
                setDecryptedContent(content);
            }
            toastIdRef.current = toast({
                description: 'Content decrypted!',
                position: 'top-left',
                status: 'success',
                duration: 3000,
            });
            setContentDecrypted(true);
        } catch (e) {
            toastIdRef.current = toast({
                description: 'Request rejected!',
                position: 'top-left',
                status: 'error',
                duration: 3000,
            });
        }
        setLoading({ ...loading, decrypting: false });
    };

    const updateWholeContent = async () => {
        setLoading({ ...loading, updating: true });
        try {
            const now = Date.now();
            const createContentDto = await userState.secretKeeper?.generateCreateContentDto({
                lastUpdate: now,
                secrets: decryptedContent.secrets,
            });
            if (!createContentDto) {
                setLoading({ ...loading, updating: false });
                return;
            }
            await userState.sendAndObtainLastEncryptedContent(createContentDto);
            setDecryptedContent({
                lastUpdate: now,
                secrets: [],
            });
            setContentDecrypted(false);
            toastIdRef.current = toast({
                description: 'Content updated!',
                position: 'top-left',
                status: 'success',
                duration: 2000,
            });
        } catch (e) {
            const err: any = e;
            toastIdRef.current = toast({
                description: err?.message || 'Request rejected!',
                position: 'top-left',
                status: 'error',
                duration: 3000,
            });
        }
        setLoading({ ...loading, updating: false });
    };

    const setDecryptedSecrets = (secrets: SecretInterface[]) => {
        setDecryptedContent({
            lastUpdate: decryptedContent.lastUpdate,
            secrets: [...secrets],
        });
    };

    if (!userState.encryptedContent) {
        return (
            <DecryptedScene
                decryptedSecrets={decryptedContent.secrets}
                setDecryptedSecrets={setDecryptedSecrets}
                updateWholeContent={updateWholeContent}
            />
        );
    }

    return (
        <Box m={4}>
            {contentDecrypted ? (
                <DecryptedScene
                    decryptedSecrets={decryptedContent.secrets}
                    setDecryptedSecrets={setDecryptedSecrets}
                    updateWholeContent={updateWholeContent}
                />
            ) : (
                <EncryptedScene
                    decryptContent={() =>
                        decryptContent(userState.encryptedContent as EncryptedContentDto)
                    }
                />
            )}
        </Box>
    );
};

export default observer(Authorized);
