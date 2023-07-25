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
import { ErrorWithCode } from '@/utils/error-with-code';
import { AnswerCode } from '@/services/ton-vault-api/answer-code';
import useTonConnectContext from '@/providers/ton-connect-provider/use-ton-connect-context';
import LoadingScreen from '@/components/loading-screen';

const Authorized: FunctionComponent = () => {
    const [contentDecrypted, setContentDecrypted] = useState<boolean>(false);
    const [secretsModified, setSecretsModified] = useState<boolean>(false);
    const [decryptedContent, setDecryptedContent] = useState<RawUserContentInterface>({
        secrets: [],
        lastUpdate: 0,
    });
    const toast = useToast();
    const toastIdRef = useRef<ToastId>();
    const { userState } = useUserContext();
    const { tonConnect } = useTonConnectContext();

    const decryptContent = async (encryptedContent: EncryptedContentDto) => {
        try {
            userState.fetchingData = true;
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
        } catch (e: any) {
            if (e.code === 1001) {
                toastIdRef.current = toast({
                    description: 'Please use only one wallet extension at a time!',
                    position: 'top-left',
                    status: 'error',
                    duration: 3000,
                });
            } else {
                toastIdRef.current = toast({
                    description: 'Request rejected!',
                    position: 'top-left',
                    status: 'error',
                    duration: 3000,
                });
            }
        } finally {
            userState.fetchingData = false;
        }
    };

    const updateWholeContent = async () => {
        try {
            userState.fetchingData = true;
            const now = Date.now();
            const createContentDto = await userState.secretKeeper?.generateCreateContentDto({
                lastUpdate: now,
                secrets: decryptedContent.secrets,
            });
            if (!createContentDto) {
                return;
            }
            await userState.sendAndObtainLastEncryptedContent(createContentDto);
            setSecretsModified(false);
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
        } catch (e: any) {
            const err: ErrorWithCode = e;
            if (err.code && err.code === AnswerCode.TokenExpired) {
                await userState.signOut(tonConnect);
            }
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
                secretsModified={secretsModified}
                setSecretsModified={setSecretsModified}
            />
        );
    }

    return (
        <Box m={4}>
            {contentDecrypted ? (
                <LoadingScreen>
                    <DecryptedScene
                        decryptedSecrets={decryptedContent.secrets}
                        setDecryptedSecrets={setDecryptedSecrets}
                        updateWholeContent={updateWholeContent}
                        secretsModified={secretsModified}
                        setSecretsModified={setSecretsModified}
                    />
                </LoadingScreen>
            ) : (
                <LoadingScreen>
                    <EncryptedScene
                        decryptContent={() =>
                            decryptContent(userState.encryptedContent as EncryptedContentDto)
                        }
                    />
                </LoadingScreen>
            )}
        </Box>
    );
};

export default observer(Authorized);
