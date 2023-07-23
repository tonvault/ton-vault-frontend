import { Wallet } from '@tonconnect/sdk';
import { CompatibleWalletNames } from '@/constant/compatible-wallets';
import { WalletApiInterface } from '@/store/secret-keeper/interface/wallet-api.interface';

export class OpenMask implements WalletApiInterface {
    readonly name: CompatibleWalletNames;

    constructor(readonly wallet: Wallet) {
        this.name = wallet.device.appName as CompatibleWalletNames;
    }

    public async sign(message: string) {
        const provider = (window as any).ton;
        return provider.send('ton_personalSign', {
            data: message,
        }) as Promise<string>;
    }
}
