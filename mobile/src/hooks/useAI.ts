import { useState } from 'react';
import { Meal } from '../store/useNutriStore';

// === À REMPLACER PAR TON URL VERCEL ===
// Exemple: 'https://nutri-ia-premium.vercel.app/api'
const BACKEND_URL = 'https://VOTRE_PROJET_SUR_VERCEL.vercel.app/api';

export const useAI = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const scanPlate = async (imageUri?: string): Promise<Partial<Meal> | null> => {
        if (!imageUri) return null;

        setIsAnalyzing(true);
        console.log("Envoi de l'image à l'IA...");

        try {
            // Dans Expo, il faut lire le fichier en base64 si l'URL ne permet pas de l'envoyer directement.
            // Vu qu'on transmet du JSON simple, on va uploader l'URI sous forme base64.
            // Pour ça, utilise expo-file-system dans l'app, ou pré-formate l'URI.
            // === APPROCHE SIMPLIFIÉE (en attendant d'implémenter expo-file-system si besoin) ===

            // fetch() vers ton Vercel
            const response = await fetch(`${BACKEND_URL}/smart-scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageUri // Attention: l'idéal est d'envoyer la chaine base64 de l'image ici
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur Backend:", data);
                throw new Error(data.error || 'Failed to scan');
            }

            console.log("Réponse de l'IA reçue !", data.result);

            if (data.result && data.result.type === 'food') {
                return data.result.data as Partial<Meal>;
            }

            return null;

        } catch (error) {
            console.error("Erreur de scan IA:", error);
            alert("Erreur de connexion à l'IA. Vérifiez votre URL Vercel.");
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateRecipe = async (prompt: string) => {
        setIsAnalyzing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsAnalyzing(false);
        return [
            { id: "r1", name: "Smoothie Protéiné", kcal: 320, time: "5 min" },
            { id: "r2", name: "Omelette aux fines herbes", kcal: 280, time: "10 min" }
        ];
    };

    return { isAnalyzing, scanPlate, generateRecipe };
};
