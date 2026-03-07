import { useState } from 'react';
import { Meal } from '../store/useNutriStore';

export const useAI = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const scanPlate = async (imageUri?: string): Promise<Partial<Meal>> => {
        setIsAnalyzing(true);

        // Simulate API call delay (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsAnalyzing(false);

        // Mock Response
        return {
            id: Math.random().toString(36).substring(7),
            name: "Poulet Teriyaki & Riz",
            ingredients: [
                { id: "1", name: "Poulet", weight: 150, kcal: 240, macros: { p: 45, c: 0, f: 5 } },
                { id: "2", name: "Riz blanc", weight: 100, kcal: 130, macros: { p: 2, c: 28, f: 0 } },
                { id: "3", name: "Sauce Teriyaki", weight: 30, kcal: 45, macros: { p: 1, c: 10, f: 0 } }
            ],
            totalKcal: 415,
            totalMacros: { p: 48, c: 38, f: 5 }
        };
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
