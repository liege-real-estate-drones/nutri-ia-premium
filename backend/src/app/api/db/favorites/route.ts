import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const USER_ID = 'user_001';
const FAVORITES_KEY = `favorites:${USER_ID}`;

export async function GET() {
    try {
        console.log('Fetching favorites from KV...');
        const favorites = await kv.get(FAVORITES_KEY);

        return NextResponse.json({ success: true, favorites: favorites || [] });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || !Array.isArray(body)) {
            return NextResponse.json({ error: 'Favorites array is required' }, { status: 400 });
        }

        console.log(`Saving ${body.length} favorites to KV...`);
        await kv.set(FAVORITES_KEY, body);

        return NextResponse.json({ success: true, message: 'Favorites synced successfully' });
    } catch (error) {
        console.error('Error saving favorites:', error);
        return NextResponse.json({ error: 'Failed to sync favorites' }, { status: 500 });
    }
}
