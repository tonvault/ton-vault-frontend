import { makeAutoObservable } from 'mobx';
import { TonProofItemReplyError, TonProofItemReplySuccess, Wallet } from '@tonconnect/sdk';
import { SecretKeeper } from '@/store/secret-keeper/secret-keeper';
import { TonVaultApi } from '@/services/ton-vault-api/ton-vault-api';
import axios from 'axios';
import { AnswerCode, AnswerDescription } from '@/services/ton-vault-api/answer-code';
import { CreateContentDto, EncryptedContentDto } from '@/services/ton-vault-api/dto';

export class UserState {
    private _wallet: Wallet | null = null;
    private _publicKey: string | null = null;
    private _isAuthorized = false;
    private _encryptedContent: EncryptedContentDto | null = null;
    private _fetchingData = false;
    constructor() {
        makeAutoObservable(this);
    }

    get fetchingData() {
        return this._fetchingData;
    }

    set fetchingData(value: boolean) {
        this._fetchingData = value;
    }

    get encryptedContent() {
        return this._encryptedContent;
    }

    set encryptedContent(value: EncryptedContentDto | null) {
        this._encryptedContent = value;
    }

    get wallet(): Wallet | null {
        return this._wallet;
    }

    set wallet(value: Wallet | null) {
        this._wallet = value;
    }

    get publicKey() {
        return this._publicKey;
    }

    set publicKey(value: string | null) {
        this._publicKey = value;
    }

    get isAuthorized() {
        return this._isAuthorized;
    }

    set isAuthorized(value: boolean) {
        this._isAuthorized = value;
    }

    async signIn(wallet: Wallet) {
        const jwt = SecretKeeper.getJwt();
        if (jwt) {
            const payload = SecretKeeper.parseJwt(jwt);
            if (payload.exp * 1000 > Date.now()) {
                this.wallet = wallet;
                this.publicKey = payload.pub;
                this.isAuthorized = true;
                return;
            }
        }
        await this.setPublicKey(wallet).catch(() => {});
        if (!this.publicKey) {
            throw new Error('Public key is not set. Have you deployed your wallet?');
        }
        const tonProof = wallet.connectItems?.tonProof;
        const error = (tonProof as TonProofItemReplyError).error;
        if (!tonProof || error) {
            throw new Error(
                `Ton proof was not provided.${error ? ' Error Code: ' + error.code : ''}`,
            );
        }
        const { code, result } = await TonVaultApi.signIn({
            addressRaw: wallet.account.address,
            walletStateInit: wallet.account.walletStateInit,
            publicKey: this.publicKey,
            tonProof: tonProof as TonProofItemReplySuccess,
        });
        if (code !== AnswerCode.success) {
            throw new Error(AnswerDescription.get(code));
        }
        SecretKeeper.setJwt(result.access_token);
        this.wallet = wallet;
        this.isAuthorized = true;
    }

    async setPublicKey(wallet: Wallet) {
        const { data } = await axios(
            `https://${
                wallet.account.chain === '-3' ? 'testnet.' : ''
            }tonapi.io/v1/wallet/getWalletPublicKey?account=${encodeURI(wallet.account.address)}`,
        );
        this.publicKey = data.publicKey;
    }

    async obtainLastEncryptedContent() {
        const token = SecretKeeper.getJwt();
        if (!token) {
            throw new Error('User is not authorized!');
        }
        const { result, code } = await TonVaultApi.getLastContent(token);

        if (code === AnswerCode.TonStorageFilesNotFound) {
            return;
        }
        if (code !== AnswerCode.success) {
            throw new Error(AnswerDescription.get(code));
        }
        if (JSON.stringify(result) !== JSON.stringify(this.encryptedContent)) {
            this.encryptedContent = result as EncryptedContentDto;
        }
    }

    // todo: single request
    async sendAndObtainLastEncryptedContent(createContentDto: CreateContentDto) {
        const token = SecretKeeper.getJwt();
        if (!token) {
            throw new Error('User is not authorized!');
        }
        const { code } = await TonVaultApi.createContent(createContentDto, token);
        if (code !== AnswerCode.success) {
            throw new Error(AnswerDescription.get(code));
        }
        await this.obtainLastEncryptedContent();
    }

    signOut() {
        this.wallet = null;
        this.publicKey = null;
        SecretKeeper.removeJwt();
        this.isAuthorized = false;
    }

    get secretKeeper() {
        if (!this.wallet) {
            return null;
        }
        return SecretKeeper.from(this.wallet);
    }
}

const userState = new UserState();

export default userState;
