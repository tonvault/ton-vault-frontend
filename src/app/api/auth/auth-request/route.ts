import { NextResponse } from 'next/server';
import { TonVaultApi } from '@/services/ton-vault-api/ton-vault-api';

export async function GET() {
    const result = await TonVaultApi.getAuthPayload();
    return NextResponse.json(result);
}
