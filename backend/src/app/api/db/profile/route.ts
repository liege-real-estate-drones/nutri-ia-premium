import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Remarque: L'ID utilisateur est hardcodé pour l'instant (mode single-user "Friends & Family")
const USER_ID = 'user_001';
const PROFILE_KEY = `profile:${USER_ID}`;

export async function GET() {
    try {
        console.log('Fetching profile from KV...');
        const profile = await kv.get(PROFILE_KEY);

        if (!profile) {
            // Profil par défaut si aucun n'est trouvé
            return NextResponse.json({
                success: true,
                profile: {
                    gender: 'Male',
                    age: 45,
                    weight: 106.5,
                    height: 180,
                    muscleMass: 76.6,
                    bmr: 2025,
                    goal: 'Recomposition corporelle',
                    activityLevel: 'Active',
                }
            });
        }

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body) {
            return NextResponse.json({ error: 'No profile data provided' }, { status: 400 });
        }

        console.log('Saving profile to KV...');
        await kv.set(PROFILE_KEY, body);

        return NextResponse.json({ success: true, message: 'Profile updated' });
    } catch (error) {
        console.error('Error saving profile:', error);
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
}
