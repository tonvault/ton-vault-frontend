import { Wallet } from '@tonconnect/sdk';
import { WalletApiInterface } from '@/store/secret-keeper/interface/wallet-api.interface';
import bootstrapWalletApi from '@/store/secret-keeper/wallet-api';
import { JwtPayloadInterface } from '@/store/secret-keeper/interface/jwt-payload.interface';
import { sha256 } from 'ton-crypto';
import { RawUserContentInterface } from '@/store/secret-keeper/interface/raw-user-content.interface';
import { CreateContentDto, EncryptedContentDto } from '@/services/ton-vault-api/dto';
import arrayBufferToBase64 from '@/utils/array-buffer-to-base64';

// todo: refresh token
// todo: place refresh token in cookie

export class SecretKeeper {
    readonly walletApi: WalletApiInterface;
    private constructor(private readonly wallet: Wallet) {
        this.walletApi = bootstrapWalletApi(wallet);
    }

    async generateCreateContentDto(rawContent: RawUserContentInterface): Promise<CreateContentDto> {
        const str = JSON.stringify(rawContent);
        const rawContentHash = (await sha256(str)).toString('hex');
        const signature = await this.walletApi.sign(this.messageToSign(rawContentHash));
        const [encryptKey, secondEncryptKey] = await Promise.all([
            this.generateKey(signature, 'encrypt'),
            this.generateKey(signature, 'encrypt', 2),
        ]);
        const encryptedContent = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: new Uint8Array(16) },
            encryptKey.cryptoKey,
            new TextEncoder().encode(str),
        );
        return {
            secondEncryptKey: secondEncryptKey.rawKey,
            encryptedContent: arrayBufferToBase64(encryptedContent),
            rawContentHash,
        };
    }

    async decryptContent({
        rawContentHash,
        content,
    }: EncryptedContentDto): Promise<RawUserContentInterface> {
        const msgToSign = this.messageToSign(rawContentHash);
        const decoder = new TextDecoder();
        const encryptedBuffer = Uint8Array.from(window.atob(content), (c) => c.charCodeAt(0));
        const signature = await this.walletApi.sign(msgToSign);
        const [decryptKey, secondDecryptKey] = await Promise.all([
            this.generateKey(signature, 'decrypt'),
            this.generateKey(signature, 'decrypt', 2),
        ]);

        const decryptedData = await crypto.subtle
            .decrypt(
                { name: 'AES-CBC', iv: new Uint8Array(16) },
                secondDecryptKey.cryptoKey,
                encryptedBuffer,
            )
            .then((encrData) =>
                crypto.subtle.decrypt(
                    { name: 'AES-CBC', iv: new Uint8Array(16) },
                    decryptKey.cryptoKey,
                    encrData,
                ),
            );

        return JSON.parse(decoder.decode(decryptedData));
    }

    private messageToSign(rawContentHash: string) {
        return `--TON VAULT KEY GENERATION MESSAGE--\n${rawContentHash}`;
    }

    private async generateKey(
        signature: string,
        keyUsage: KeyUsage,
        hashAmount = 1,
    ): Promise<{ rawKey: string; cryptoKey: CryptoKey }> {
        let key: Buffer;
        key = await sha256(signature);
        for (let i = 1; i < hashAmount; i++) {
            key = await sha256(key);
        }
        return {
            cryptoKey: await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'AES-CBC', length: 256 },
                false,
                [keyUsage],
            ),
            rawKey: key.toString('hex'),
        };
    }

    public static parseJwt(token: string): JwtPayloadInterface {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );

        return JSON.parse(jsonPayload);
    }

    public static from(walletInfo: Wallet): SecretKeeper {
        return new SecretKeeper(walletInfo);
    }

    public static getJwt(): string | null {
        return localStorage.getItem('access_token');
    }

    public static setJwt(token: string): void {
        localStorage.setItem('access_token', token);
    }

    public static removeJwt(): void {
        localStorage.removeItem('access_token');
    }

    public static checkJwt(token: string | null): boolean {
        if (!token) {
            return false;
        }
        const payload = SecretKeeper.parseJwt(token);
        return payload.exp * 1000 > Date.now();
    }
}
