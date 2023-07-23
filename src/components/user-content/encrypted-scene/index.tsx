import React, { FunctionComponent } from 'react';
import { Button, StackDivider, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { TypeAnimation } from 'react-type-animation';
import cls from './encrypted-scene.module.css';

type EncryptedContentProps = {
    decryptContent: () => void;
};

const EncryptedScene: FunctionComponent<EncryptedContentProps> = ({ decryptContent }) => {
    return (
        <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="center">
            <Button m={4} colorScheme="gray" onClick={decryptContent}>
                Decrypt content
            </Button>
            <TypeAnimation
                sequence={[
                    '48 65 6c 6c 6f 20 57 6f 72 6c 64 21 20 49 20 61 6d 20 54 6f 6e 20 56 61 75 6c 74 21',
                    1000,
                    '48 65 6c 6c 6f 20 57 6f 72 6c 64 21 20 49 20 61 6d 20 54 6f 6e 20 53 74 6f 72 61 67 65 21',
                    1000,
                    '48 65 6c 6c 6f 20 57 6f 72 6c 64 21 20 49 20 61 6d 20 6d 61 67 69 63 69 61 6e 21',
                    1000,
                ]}
                wrapper="span"
                speed={50}
                className={cls.text}
                repeat={Infinity}
            />
        </VStack>
    );
};

export default observer(EncryptedScene);
