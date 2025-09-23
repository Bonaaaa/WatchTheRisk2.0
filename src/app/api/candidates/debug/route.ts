import { NextResponse } from 'next/server';
import { getCandidates, initializeStore } from '@/app/candidates/service';

export async function GET() {
    try {
        await initializeStore();
        const candidates = await getCandidates();
        
        return NextResponse.json({
            success: true,
            count: candidates.length,
            candidates: candidates,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
