import { CompatibleWalletNames } from '@/constant/compatible-wallets';

const isCompatibleWithSecretKeeper = (walletName: CompatibleWalletNames) => {
    return Object.values(CompatibleWalletNames).includes(walletName);
};

export default isCompatibleWithSecretKeeper;
