import { AnswerCode } from '@/services/ton-vault-api/answer-code';

export class ErrorWithCode extends Error {
    constructor(readonly code: AnswerCode, data: any) {
        super(data);
    }
}
