import { AnswerCode } from '@/services/ton-vault-api/answer-code';

export interface GeneralApiAnswerDto<T = string> {
    result: T;
    code: AnswerCode;
}
