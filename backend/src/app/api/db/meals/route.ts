import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const USER_ID = 'user_001';
// Clés pour l'historique des repas par date. Ex: meals:user_001:2025-01-01
const getMealsKey = (dateStr: string) => `meals:${USER_ID}:${dateStr}`;

export async function GET(request: Request) {
    try {
        // Optionnel : Passer la date dans l'URL ?date=2025-01-01
        const { searchParams } = new URL(request.url);
        let dateStr = searchParams.get('date');

        // Par défaut, la date du jour au format YYYY-MM-DD
        if (!dateStr) {
            dateStr = new Date().toISOString().split('T')[0];
        }

        const key = getMealsKey(dateStr);
        console.log(`Fetching meals for ${key}...`);

        const meals = await kv.get(key);

        return NextResponse.json({ success: true, meals: meals || [] });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, meals } = body;

        if (!date || !meals) {
            return NextResponse.json({ error: 'Date or meals are missing' }, { status: 400 });
        }

        const dateStr = new Date(date).toISOString().split('T')[0];
        const key = getMealsKey(dateStr);

        console.log(`Saving ${meals.length} meals to KV for ${key}...`);
        await kv.set(key, meals);

        return NextResponse.json({ success: true, message: 'Meals synced successfully' });
    } catch (error) {
        console.error('Error saving meals:', error);
        return NextResponse.json({ error: 'Failed to sync meals' }, { status: 500 });
    }
}
