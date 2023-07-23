import { Wallet } from '@tonconnect/sdk';
import { CompatibleWalletNames } from '@/constant/compatible-wallets';
import { OpenMask } from '@/store/secret-keeper/wallet-api/open-mask';
import { MyTonWallet } from '@/store/secret-keeper/wallet-api/mytonwallet';

export default function bootstrapWalletApi(wallet: Wallet) {
    const name = wallet.device.appName as CompatibleWalletNames;
    switch (name) {
        case CompatibleWalletNames.OpenMask:
            return new OpenMask(wallet);
        case CompatibleWalletNames.TonWallet:
            return new MyTonWallet(wallet);
        default:
            throw new Error('Incompatible wallet-api');
    }
}
