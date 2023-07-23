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

// todo: refresh token
export class TonVaultApi {
    private constructor() {}

    public static async getAuthPayload(): Promise<GeneralApiAnswerDto<ConnectAdditionalRequest>> {
        const res = await axios.get<GeneralApiAnswerDto<ConnectAdditionalRequest>>(
            'auth/auth-request',
            {
                baseURL: Env.tonVaultApiUrl,
            },
        );
        return { code: res.data.code, result: res.data.result };
    }

    public static async signIn(signInDto: SignInDto): Promise<GeneralApiAnswerDto<AccessTokenDto>> {
        const { data } = await axios.post<GeneralApiAnswerDto<AccessTokenDto>>(
            'auth/login',
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
            `get/${parsedToken.pub}`,
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
        >('create', createContentDto, {
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
