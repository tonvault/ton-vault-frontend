export class Env {
    private constructor() {}

    public static get isDev() {
        return process.env.NODE_ENV === 'development';
    }

    public static get tonVaultApiUrl() {
        if (!process.env.NEXT_PUBLIC_TON_VAULT_API_URL) {
            throw new Error('NEXT_PUBLIC_TON_VAULT_API_URL is not defined');
        }
        return process.env.NEXT_PUBLIC_TON_VAULT_API_URL;
    }

    public static get tonConnectManifestUrl() {
        if (!process.env.NEXT_PUBLIC_MANIFEST_URL) {
            throw new Error('NEXT_PUBLIC_TON_CONNECT_MANIFEST_URL is not defined');
        }
        return process.env.NEXT_PUBLIC_MANIFEST_URL;
    }
}
