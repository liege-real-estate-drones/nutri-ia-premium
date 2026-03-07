import { NextResponse } from 'next/server';

// Prompt Système Strict pour le routeur multimodal
const SYSTEM_PROMPT = `
Tu es le cerveau analytique de Nutri-IA Premium. 
Analyse l'image fournie et détermine de quel cas il s'agit.
Retourne STRICTEMENT un objet JSON valide suivant l'un de ces deux schémas :

CAS A (Mode Stats - Capture EGYM/BioAge) :
{
  "type": "stats",
  "data": {
    "weight": Number (en kg),
    "muscleMass": Number (en kg),
    "fatPercentage": Number (en %),
    "bmr": Number (en kcal)
  }
}

CAS B (Mode Food - Assiette/Emballage) :
{
  "type": "food",
  "data": {
    "name": String (Titre du repas),
    "ingredients": [
      {
        "id": String (uuid),
        "name": String,
        "weight": Number (en g),
        "kcal": Number,
        "macros": { "p": Number, "c": Number, "f": Number }
      }
    ],
    "totalKcal": Number,
    "totalMacros": { "p": Number, "c": Number, "f": Number }
  }
}
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        console.log('Analyse multimodale de l\'image en cours...');

        // === IMPLEMENTATION REELLE ===
        // Ici, appel vers OpenAI (gpt-4o) ou Gemini (gemini-1.5-pro)
        // en utilisant SYSTEM_PROMPT et l'image en base64.

        // Simulation du LLM pour la preuve de concept :
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Mocking : On décide aléatoirement ou selon un mot-clé (si text fallback)
        const isStatsMode = Math.random() > 0.5;

        let mockResponse;
        if (isStatsMode) {
            mockResponse = {
                type: 'stats',
                data: {
                    weight: 105.8,
                    muscleMass: 77.1,
                    fatPercentage: 22.5,
                    bmr: 2040
                }
            };
        } else {
            mockResponse = {
                type: 'food',
                data: {
                    name: "Salade César Premium",
                    ingredients: [
                        { id: "1", name: "Blanc de poulet", weight: 150, kcal: 165, macros: { p: 31, c: 0, f: 3 } },
                        { id: "2", name: "Salade Romaine", weight: 100, kcal: 17, macros: { p: 1, c: 3, f: 0 } },
                        { id: "3", name: "Sauce César allégée", weight: 30, kcal: 80, macros: { p: 1, c: 2, f: 8 } },
                        { id: "4", name: "Parmesan", weight: 15, kcal: 60, macros: { p: 5, c: 0, f: 4 } }
                    ],
                    totalKcal: 322,
                    totalMacros: { p: 38, c: 5, f: 15 }
                }
            };
        }

        return NextResponse.json({
            success: true,
            result: mockResponse
        });

    } catch (error) {
        console.error('Smart Scan Error:', error);
        return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }
}
