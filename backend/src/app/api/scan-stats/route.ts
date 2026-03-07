import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log('Receiving stats for EGYM/BioAge analysis...');
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return NextResponse.json({
            success: true,
            data: {
                metabolicAge: 38,
                muscleMass: 42,
                fatPercentage: 22,
                recommendation: "Focus on protein intake to preserve muscle mass while reducing fat."
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to analyze stats' }, { status: 500 });
    }
}
