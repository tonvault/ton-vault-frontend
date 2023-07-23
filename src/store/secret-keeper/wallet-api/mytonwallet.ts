import { Wallet } from '@tonconnect/sdk';
import { CompatibleWalletNames } from '@/constant/compatible-wallets';
import { WalletApiInterface } from '@/store/secret-keeper/interface/wallet-api.interface';

export class MyTonWallet implements WalletApiInterface {
    readonly name: CompatibleWalletNames;

    constructor(readonly wallet: Wallet) {
        this.name = wallet.device.appName as CompatibleWalletNames;
    }

    public async sign(message: string) {
        const provider = (window as any).ton;
        const hexMessage = Buffer.concat([
            Buffer.from([0xff, 0xff]),
            Buffer.from('ton-safe-sign-magic'),
            Buffer.from(message, 'utf8'),
        ]).toString('hex');
        return provider.send('ton_rawSign', [
            {
                data: hexMessage,
            },
        ]) as Promise<string>;
    }
}
