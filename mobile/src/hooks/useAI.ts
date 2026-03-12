import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Meal } from '../store/useNutriStore';

// === À REMPLACER PAR TON URL VERCEL ===
// Exemple: 'https://nutri-ia-premium.vercel.app/api'
const BACKEND_URL = 'https://nutri-ia-premium.vercel.app/api';

export const useAI = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Fonction utilitaire pour compresser et encoder l'image en Base64
    const processImageToBase64 = async (uri: string): Promise<string> => {
        try {
            // Redimensionne l'image (max 800px de large pour réduire le poids) et la compresse (jpeg 70%)
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Lit le fichier compressé et l'encode en Base64
            const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
                encoding: 'base64', // String literal instead of missing enum
            });

            return base64;
        } catch (error) {
            console.error("Erreur lors de la compression de l'image:", error);
            throw new Error("Impossible de traiter l'image.");
        }
    };

    const scanPlate = async (imageUri?: string): Promise<Partial<Meal> | null> => {
        if (!imageUri) return null;

        setIsAnalyzing(true);
        console.log("Envoi de l'image à l'IA...");

        try {
            const base64Image = await processImageToBase64(imageUri);

            // fetch() vers ton Vercel
            const response = await fetch(`${BACKEND_URL}/smart-scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image
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

    const generateRecipe = async (prompt: string, imageUri?: string, remainingMacros?: any) => {
        setIsAnalyzing(true);
        console.log("Envoi au Frigo Magique...");

        try {
            let base64Image: string | undefined = undefined;
            if (imageUri && !imageUri.startsWith('data:image')) {
                base64Image = await processImageToBase64(imageUri);
            } else if (imageUri) {
                base64Image = imageUri; // Already base64 encoded from the UI
            }

            const response = await fetch(`${BACKEND_URL}/frigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredientsText: prompt,
                    imageBase64: base64Image,
                    remainingMacros
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur Backend Frigo:", data);
                throw new Error(data.error || 'Failed to generate recipes');
            }

            return data.recipes || [];

        } catch (error) {
            console.error("Erreur Frigo IA:", error);
            alert("Erreur de connexion à l'IA pour les recettes.");
            return [];
        } finally {
            setIsAnalyzing(false);
        }
    };

    return { isAnalyzing, scanPlate, generateRecipe };
};
