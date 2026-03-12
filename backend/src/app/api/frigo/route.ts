import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ingredientsText, imageBase64, remainingMacros } = body;

        console.log('Analyse Frigo Magique avec Gemini en cours...');

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Clé API Gemini manquante côté serveur.' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const parts: Part[] = [];

        const systemPrompt = `Tu es un chef cuisinier expert en nutrition. Ton but est de créer exactement DEUX (2) recettes à partir des ingrédients fournis.
L'utilisateur a un budget calorique RESTANT pour la journée de : ${remainingMacros?.kcal || 'inconnu'} Kcal (${remainingMacros?.p || 0}g Protéines, ${remainingMacros?.c || 0}g Glucides, ${remainingMacros?.f || 0}g Lipides).
Analyse les ingrédients (texte ou image) et propose 2 recettes optimisées pour se rapprocher de ces macros restantes.
Tu dois répondre UNIQUEMENT par un tableau JSON valide, sans bloc de code markdown, contenant des objets selon cette structure exacte :
[
  {
    "id": "r1",
    "title": "Nom de la recette",
    "kcal": 450,
    "time": "20 min",
    "macros": { "p": 40, "c": 30, "f": 15 },
    "description": "Explication courte de la préparation"
  }
]`;

        parts.push({ text: systemPrompt });

        if (ingredientsText) {
            parts.push({ text: `Ingrédients proposés : ${ingredientsText}` });
        }

        if (imageBase64) {
            parts.push({
                inlineData: {
                    data: imageBase64.split(',')[1] || imageBase64,
                    mimeType: "image/jpeg"
                }
            });
        }

        const result = await model.generateContent(parts);
        const responseText = result.response.text();

        let recipes;
        try {
            const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            recipes = JSON.parse(cleanJson);
        } catch (e) {
            console.error('Erreur parsing JSON Gemini:', responseText);
            throw new Error('Format de réponse invalide provenant de l\'IA');
        }

        return NextResponse.json({ success: true, recipes });

    } catch (error: unknown) {
        console.error('Erreur Frigo API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipes';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
