import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        console.log(`Receiving chat message: ${message}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            reply: "C'est une excellente question. Je te suggère de boire au moins 2.5L d'eau aujourd'hui vu ton poids de 106.5kg."
        });
    } catch (error) {
        return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
    }
}
