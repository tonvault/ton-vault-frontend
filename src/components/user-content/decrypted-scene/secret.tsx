import React, { FunctionComponent, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Grid,
    GridItem,
    Heading,
    IconButton,
    ListItem,
    UnorderedList,
    useClipboard,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { SecretInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';

type SecretProps = {
    secret: SecretInterface;
    removeSecret: (secret: SecretInterface) => void;
    showModal: (secret: SecretInterface) => void;
};

const Secret: FunctionComponent<SecretProps> = ({ secret, removeSecret, showModal }) => {
    const [showPass, setShowPass] = useState(false);
    const passwordCopy = useClipboard(secret.password);
    const loginCopy = useClipboard(secret.login);

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const activeButtons = () => {
        return (
            <Wrap>
                <WrapItem>
                    <Button
                        size="sm"
                        mx={1}
                        colorScheme="gray"
                        onClick={() => removeSecret(secret)}
                    >
                        Remove
                    </Button>
                </WrapItem>
                <WrapItem>
                    <Button size="sm" mx={1} colorScheme="gray" onClick={() => showModal(secret)}>
                        Edit
                    </Button>
                </WrapItem>
            </Wrap>
        );
    };

    return (
        <Box>
            <Card
                size="sm"
                bgGradient={['linear(45deg, #1E2531, 60%, #2F93E8)']}
                color="white"
                fontWeight="extrabold"
            >
                <CardBody>
                    <Heading p={2} size="lg">
                        {secret.name}
                    </Heading>
                    <UnorderedList>
                        <ListItem>
                            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
                                <GridItem colSpan={3}>Login:</GridItem>
                                <GridItem colSpan={6}>{secret.login}</GridItem>
                                <GridItem colSpan={1} onClick={loginCopy.onCopy}>
                                    <IconButton
                                        icon={loginCopy.hasCopied ? <CheckIcon /> : <CopyIcon />}
                                        size="xs"
                                        aria-label="copy"
                                    />
                                </GridItem>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
                                <GridItem colSpan={3}>Password:</GridItem>
                                <GridItem colSpan={6} onClick={handleShowPass} cursor={'pointer'}>
                                    {showPass ? secret.password : <i>•••••••••</i>}
                                </GridItem>
                                <GridItem colSpan={1} onClick={passwordCopy.onCopy}>
                                    <IconButton
                                        icon={passwordCopy.hasCopied ? <CheckIcon /> : <CopyIcon />}
                                        size="xs"
                                        aria-label="copy"
                                    />
                                </GridItem>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
                                <GridItem colSpan={3}>Website:</GridItem>
                                <GridItem colSpan={7}>{secret.addInfo.url}</GridItem>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
                                <GridItem colSpan={3}>Phone:</GridItem>
                                <GridItem colSpan={7}>{secret.addInfo.phone}</GridItem>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
                                <GridItem colSpan={3}>Email:</GridItem>
                                <GridItem colSpan={7}>{secret.addInfo.email}</GridItem>
                            </Grid>
                        </ListItem>
                    </UnorderedList>
                </CardBody>
                <Divider />
                <CardFooter>{activeButtons()}</CardFooter>
            </Card>
        </Box>
    );
};

export default Secret;
