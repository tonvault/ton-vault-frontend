import { Box, Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

type WelcomeTextProps = {
    children: any;
};

const WelcomeText: FunctionComponent<WelcomeTextProps> = ({ children }) => {
    return (
        <Text
            bgGradient="linear(120deg, #1E2531, 60%, #2F93E8)"
            bgClip="text"
            fontSize="6xl"
            fontWeight="extrabold"
            align="center"
        >
            {children}
        </Text>
    );
};

const NotAuthorized = () => {
    // todo: prettify
    return (
        <Box py="20vh">
            <WelcomeText>Welcome to Ton Vault alpha version</WelcomeText>
            <WelcomeText>Connect your wallet to continue</WelcomeText>
        </Box>
    );
};

export default NotAuthorized;
