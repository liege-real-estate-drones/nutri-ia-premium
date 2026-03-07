import { create } from 'zustand';

export type Macro = {
    p: number; // Proteines
    c: number; // Glucides (Carbs)
    f: number; // Lipides (Fat)
};

export type Ingredient = {
    id: string;
    name: string;
    weight: number; // in grams
    kcal: number;
    macros: Macro;
};

export type Meal = {
    id: string;
    name: string;
    ingredients: Ingredient[];
    totalKcal: number;
    totalMacros: Macro;
    date: string;
};

interface NutriState {
    // Goals
    goalKcal: number;
    goalMacros: Macro;

    // Current Day
    consumedKcal: number;
    consumedMacros: Macro;
    meals: Meal[];

    // Actions
    addMeal: (meal: Meal) => void;
    removeMeal: (mealId: string) => void;
    resetDay: () => void;
}

export const useNutriStore = create<NutriState>((set) => ({
    goalKcal: 2500,
    goalMacros: { p: 150, c: 250, f: 80 },

    consumedKcal: 1240, // Mock initial state to show gauge
    consumedMacros: { p: 65, c: 110, f: 35 },
    meals: [],

    addMeal: (meal) => set((state) => ({
        meals: [...state.meals, meal],
        consumedKcal: state.consumedKcal + meal.totalKcal,
        consumedMacros: {
            p: state.consumedMacros.p + meal.totalMacros.p,
            c: state.consumedMacros.c + meal.totalMacros.c,
            f: state.consumedMacros.f + meal.totalMacros.f,
        }
    })),

    removeMeal: (mealId) => set((state) => {
        const mealToRemove = state.meals.find(m => m.id === mealId);
        if (!mealToRemove) return state;

        return {
            meals: state.meals.filter(m => m.id !== mealId),
            consumedKcal: Math.max(0, state.consumedKcal - mealToRemove.totalKcal),
            consumedMacros: {
                p: Math.max(0, state.consumedMacros.p - mealToRemove.totalMacros.p),
                c: Math.max(0, state.consumedMacros.c - mealToRemove.totalMacros.c),
                f: Math.max(0, state.consumedMacros.f - mealToRemove.totalMacros.f),
            }
        };
    }),

    resetDay: () => set({
        consumedKcal: 0,
        consumedMacros: { p: 0, c: 0, f: 0 },
        meals: []
    })
}));
