import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Prompt Système Strict pour le routeur multimodal
const SYSTEM_PROMPT = `
Tu es le cerveau analytique de Nutri-IA Premium. 
Analyse l'image fournie et détermine de quel cas il s'agit.
Retourne STRICTEMENT un objet JSON valide suivant l'un de ces deux schémas :

CAS A (Mode Stats - Capture EGYM/BioAge ou balance connectée) :
{
  "type": "stats",
  "data": {
    "weight": Number (en kg),
    "muscleMass": Number (en kg),
    "fatPercentage": Number (en %),
    "bmr": Number (en kcal)
  }
}

CAS B (Mode Food - Assiette de nourriture ou emballage alimentaire) :
{
  "type": "food",
  "data": {
    "name": String (Titre court et appétissant du repas),
    "ingredients": [
      {
        "id": String (identifiant unique court),
        "name": String (Nom de l'aliment),
        "weight": Number (estimation réaliste en g),
        "kcal": Number,
        "macros": { "p": Number, "c": Number, "f": Number }
      }
    ],
    "totalKcal": Number,
    "totalMacros": { "p": Number, "c": Number, "f": Number }
  }
}

Ne réponds rien d'autre que le JSON. Si tu n'arrives pas à identifier, essaie de deviner au mieux.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body; // Attendu en base64

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log('Analyse multimodale Gemini en cours...');

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Conversion de l'image base64 pour Gemini
    const imageParts: Part[] = [
      {
        inlineData: {
          data: image.split(',')[1] || image, // Gérer le préfixe data:image/jpeg;base64,
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([SYSTEM_PROMPT, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Nettoyage du texte (parfois les LLM ajoutent ```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonResult = JSON.parse(text);

    return NextResponse.json({
      success: true,
      result: jsonResult
    });

  } catch (error) {
    console.error('Gemini Smart Scan Error:', error);
    return NextResponse.json({
      error: 'Failed to analyze image',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
