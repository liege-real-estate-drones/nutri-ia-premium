import { useState } from 'react';
import { Meal } from '../store/useNutriStore';

// URL for API. Needs to point to localhost or physical machine IP in dev, and Vercel in prod.
// You must set EXPO_PUBLIC_API_URL in a .env files inside the /mobile directory.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const useAI = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const scanPlate = async (imageUri?: string): Promise<Partial<Meal> | null> => {
        setIsAnalyzing(true);

        try {
            // Create FormData to upload an image
            const formData = new FormData();
            if (imageUri) {
                // Mocking the image to upload
                formData.append('image', {
                    uri: imageUri,
                    name: 'plate.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            const response = await fetch(`${API_URL}/api/scan-food`, {
                method: 'POST',
                // Next.js route we built expects a POST, could be multipart or json depending on implementation
            });

            const result = await response.json();
            setIsAnalyzing(false);

            if (result.success) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error("Failed to scan plate via API:", error);
            setIsAnalyzing(false);
            return null;
        }
    };

    const generateRecipe = async (prompt: string) => {
        // This will be another API route later
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
