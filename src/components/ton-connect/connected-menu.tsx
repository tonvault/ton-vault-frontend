import React, { FunctionComponent } from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList, useClipboard } from '@chakra-ui/react';
import { ITonConnect } from '@tonconnect/sdk';

type MenuButtonProps = {
    address: string;
    tonConnect: ITonConnect | null;
};

const ConnectedMenu: FunctionComponent<MenuButtonProps> = ({ address, tonConnect }) => {
    const { onCopy, hasCopied } = useClipboard(address);
    return (
        <Menu>
            <MenuButton as={Button}>
                {[address.slice(0, 4), address.slice(-4)].join('...')}
            </MenuButton>
            <MenuList>
                <MenuItem closeOnSelect={false} onClick={onCopy}>
                    {hasCopied ? 'Copied' : 'Copy Address'}
                </MenuItem>
                <MenuItem onClick={() => tonConnect?.disconnect()}>Disconnect</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default ConnectedMenu;
