import { TonProofItemReplySuccess } from '@tonconnect/sdk';

export interface SignInDto {
    publicKey: string;
    addressRaw: string;
    walletStateInit: string;
    tonProof: TonProofItemReplySuccess;
}
