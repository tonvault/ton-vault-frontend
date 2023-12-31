import { ConnectAdditionalRequest } from '@tonconnect/sdk';
import {
    AccessTokenDto,
    CreateContentDto,
    EncryptedContentDto,
    GeneralApiAnswerDto,
    SignInDto,
} from '@/services/ton-vault-api/dto';
import axios, { AxiosResponse } from 'axios';
import { Env } from '@/services/env/env';
import { SecretKeeper } from '@/store/secret-keeper/secret-keeper';

export enum TonVaultApiRoutes {
    AUTH_REQUEST = 'auth/auth-request',
    LOGIN = 'auth/login',
    GET = 'get',
    CREATE = 'create',
}

// todo: refresh token
export class TonVaultApi {
    private constructor() {}

    public static async getAuthPayload(): Promise<GeneralApiAnswerDto<ConnectAdditionalRequest>> {
        const res = await axios.get<GeneralApiAnswerDto<ConnectAdditionalRequest>>(
            TonVaultApiRoutes.AUTH_REQUEST,
            {
                baseURL: Env.tonVaultApiUrl,
            },
        );
        return { code: res.data.code, result: res.data.result };
    }

    public static async signIn(signInDto: SignInDto): Promise<GeneralApiAnswerDto<AccessTokenDto>> {
        const { data } = await axios.post<GeneralApiAnswerDto<AccessTokenDto>>(
            TonVaultApiRoutes.LOGIN,
            signInDto,
            {
                baseURL: Env.tonVaultApiUrl,
            },
        );
        return {
            code: data.code,
            result: data.result,
        };
    }

    public static async getLastContent(
        token: string,
    ): Promise<GeneralApiAnswerDto<EncryptedContentDto | string>> {
        const parsedToken = SecretKeeper.parseJwt(token);
        const { data } = await axios.get<GeneralApiAnswerDto<EncryptedContentDto | string>>(
            `${TonVaultApiRoutes.GET}/${parsedToken.pub}`,
            {
                baseURL: Env.tonVaultApiUrl,
            },
        );
        return {
            code: data.code,
            result: data.result,
        };
    }

    public static async createContent(
        createContentDto: CreateContentDto,
        token: string,
    ): Promise<GeneralApiAnswerDto<null>> {
        const { data } = await axios.post<
            GeneralApiAnswerDto,
            AxiosResponse<GeneralApiAnswerDto>,
            CreateContentDto
        >(TonVaultApiRoutes.CREATE, createContentDto, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            baseURL: Env.tonVaultApiUrl,
        });
        return {
            result: null,
            code: data.code,
        };
    }
}
