export interface WalletApiInterface {
    sign: (message: string) => Promise<string>;
}
