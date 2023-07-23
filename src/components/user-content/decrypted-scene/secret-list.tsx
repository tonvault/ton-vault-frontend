import React, { FunctionComponent } from 'react';
import { SecretInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';
import { SimpleGrid } from '@chakra-ui/react';
import Secret from '@/components/user-content/decrypted-scene/secret';
import AddSecret from '@/components/user-content/decrypted-scene/add-secret';

type DecryptedContentProps = {
    secretsList: SecretInterface[];
    removeSecret: (secret: SecretInterface) => void;
    showModal: (secret: SecretInterface) => void;
};

const SecretList: FunctionComponent<DecryptedContentProps> = ({
    secretsList,
    removeSecret,
    showModal,
}) => {
    return (
        <SimpleGrid m={4} spacing={4} templateColumns="repeat(auto-fill, minmax(350px, 1fr))">
            {secretsList.map((secret) => {
                return (
                    <Secret
                        key={secret.id}
                        secret={secret}
                        removeSecret={removeSecret}
                        showModal={showModal}
                    />
                );
            })}
            <AddSecret showModal={showModal} />
        </SimpleGrid>
    );
};

export default SecretList;
