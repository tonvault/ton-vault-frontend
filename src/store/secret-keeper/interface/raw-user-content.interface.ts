export interface RawUserContentInterface {
    lastUpdate: number;
    secrets: SecretInterface[];
}

export interface SecretInterface {
    id: string;
    name: string;
    login: string;
    password: string;
    addInfo: AddInfo;
}

export interface AddInfo {
    email: string;
    phone: string;
    url: string;
}
