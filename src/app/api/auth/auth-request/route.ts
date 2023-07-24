import { NextResponse } from 'next/server';
import { TonVaultApi } from '@/services/ton-vault-api/ton-vault-api';
import { headers } from 'next/headers';

export async function GET() {
    const headersList = headers();
    const result = await TonVaultApi.getAuthPayload();
    return NextResponse.json(result);
}
