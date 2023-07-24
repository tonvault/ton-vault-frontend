'use client';

import React, { FunctionComponent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SecretInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import SecretList from '@/components/user-content/decrypted-scene/secret-list';
import EditSecretModal from '@/components/user-content/decrypted-scene/edit-secret-modal';
import { emptySecret } from '@/components/user-content/decrypted-scene/empty-secret';

type DecryptedSceneProps = {
    decryptedSecrets: SecretInterface[];
    setDecryptedSecrets: (secrets: SecretInterface[]) => void;
    updateWholeContent: () => void;
    setSecretsModified: (modified: boolean) => void;
    secretsModified: boolean;
};

const DecryptedScene: FunctionComponent<DecryptedSceneProps> = ({
    decryptedSecrets,
    setDecryptedSecrets,
    updateWholeContent,
    setSecretsModified,
    secretsModified,
}) => {
    const [activeSecret, setActiveSecret] = useState<SecretInterface>(emptySecret);
    const { isOpen, onClose, onOpen } = useDisclosure();

    const editSecret = (newSecret: SecretInterface) => {
        const secretIndex = decryptedSecrets.findIndex((secret) => secret.id === newSecret.id);
        if (
            secretIndex !== -1 &&
            JSON.stringify(decryptedSecrets[secretIndex]) !== JSON.stringify(newSecret)
        ) {
            const updatedDecryptedSecrets = decryptedSecrets.slice();
            updatedDecryptedSecrets[secretIndex] = newSecret;
            setDecryptedSecrets(updatedDecryptedSecrets);
            setSecretsModified(true);
        }
    };

    const removeSecret = (secret: SecretInterface) => {
        setDecryptedSecrets(decryptedSecrets.filter((s) => s.id !== secret.id));
        setSecretsModified(true);
    };

    const createSecret = (newSecret: SecretInterface) => {
        newSecret.id = newSecret.name + Date.now();
        setDecryptedSecrets([...decryptedSecrets, newSecret]);
        setSecretsModified(true);
    };

    const showModal = (secret: SecretInterface) => {
        setActiveSecret(secret);
        onOpen();
    };
    return (
        <Box>
            <SecretList
                secretsList={decryptedSecrets}
                removeSecret={removeSecret}
                showModal={showModal}
            />
            {secretsModified ? (
                <Button m={4} variant="outline" colorScheme="red" onClick={updateWholeContent}>
                    Save changes
                </Button>
            ) : null}
            <EditSecretModal
                activeSecret={activeSecret}
                isOpen={isOpen}
                onClose={onClose}
                editSecret={editSecret}
                createSecret={createSecret}
            />
        </Box>
    );
};

export default observer(DecryptedScene);
