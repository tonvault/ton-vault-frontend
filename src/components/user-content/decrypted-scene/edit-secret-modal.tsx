import React, { FunctionComponent, useEffect, useState } from 'react';
import { SecretInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/modal';
import { Button, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import { Input } from '@chakra-ui/input';
import { emptySecret } from '@/components/user-content/decrypted-scene/empty-secret';

type EditSecretFormProps = {
    editSecret: (secret: SecretInterface) => void;
    createSecret: (secret: SecretInterface) => void;
    activeSecret: SecretInterface;
    isOpen: boolean;
    onClose: () => void;
};

const EditSecretModal: FunctionComponent<EditSecretFormProps> = ({
    editSecret,
    createSecret,
    activeSecret,
    isOpen,
    onClose,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);
    const [localSecret, setLocalSecret] = useState<SecretInterface>(emptySecret);
    const handleClick = () => setShowPassword(!showPassword);

    useEffect(() => {
        setLocalSecret(activeSecret);
    }, [isOpen]);

    const onCloseModal = () => {
        onClose();
        setIsInvalidName(false);
        setIsInvalidPassword(false);
    };

    const updateSecret = () => {
        if (isInvalidName) setIsInvalidName(false);
        if (isInvalidPassword) setIsInvalidPassword(false);
        if (!localSecret.name.length || !localSecret.password.length) {
            if (!localSecret.name.length) setIsInvalidName(true);
            if (!localSecret.password.length) setIsInvalidPassword(true);
            return;
        }
        localSecret.id.length ? editSecret(localSecret) : createSecret(localSecret);
        onCloseModal();
    };

    return (
        <Modal isCentered onClose={onCloseModal} isOpen={isOpen} motionPreset="slideInBottom">
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    {!localSecret.id.length ? 'Create Secret' : 'Edit Secret'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <Input
                            isInvalid={isInvalidName}
                            placeholder="Name"
                            onChange={(e) =>
                                setLocalSecret({ ...localSecret, name: e.target.value })
                            }
                            value={localSecret.name}
                        />
                        <Input
                            isInvalid={isInvalidName}
                            placeholder="Login"
                            onChange={(e) =>
                                setLocalSecret({ ...localSecret, login: e.target.value })
                            }
                            value={localSecret.login}
                        />
                        <InputGroup size="md">
                            <Input
                                isInvalid={isInvalidPassword}
                                pr="4.5rem"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                onChange={(e) =>
                                    setLocalSecret({ ...localSecret, password: e.target.value })
                                }
                                value={localSecret.password}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Input
                            placeholder="Website"
                            onChange={(e) =>
                                setLocalSecret({
                                    ...localSecret,
                                    addInfo: {
                                        ...localSecret.addInfo,
                                        url: e.target.value,
                                    },
                                })
                            }
                            value={localSecret.addInfo.url}
                        />
                        <Input
                            placeholder="Email"
                            onChange={(e) =>
                                setLocalSecret({
                                    ...localSecret,
                                    addInfo: {
                                        ...localSecret.addInfo,
                                        email: e.target.value,
                                    },
                                })
                            }
                            value={localSecret.addInfo.email}
                        />
                        <Input
                            placeholder="Phone"
                            onChange={(e) =>
                                setLocalSecret({
                                    ...localSecret,
                                    addInfo: {
                                        ...localSecret.addInfo,
                                        phone: e.target.value,
                                    },
                                })
                            }
                            value={localSecret.addInfo.phone}
                        />
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={updateSecret}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditSecretModal;
