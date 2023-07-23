import React, { FunctionComponent } from 'react';
import { Card, CardBody, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { SecretInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';
import { emptySecret } from '@/components/user-content/decrypted-scene/empty-secret';

type AddSecretProps = {
    showModal: (secret: SecretInterface) => void;
};

const AddSecret: FunctionComponent<AddSecretProps> = ({ showModal }) => {
    return (
        <>
            <Card
                size="sm"
                align="center"
                bgGradient={['linear(45deg, #1E2531, 60%, #2F93E8)']}
                color="white"
                fontWeight="extrabold"
            >
                <CardBody>
                    <IconButton
                        icon={<AddIcon />}
                        p={28}
                        size="lg"
                        fontSize="50px"
                        variant="ghost"
                        colorScheme="alphaWhite"
                        aria-label="add"
                        onClick={() => showModal(emptySecret)}
                    />
                </CardBody>
            </Card>
        </>
    );
};

export default AddSecret;
