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

interface UserProfile {
    gender: 'Male' | 'Female';
    age: number;
    weight: number; // kg
    muscleMass: number; // kg
    bmr: number; // kcal
    goal: string;
}

interface NutriState {
    // User Context
    profile: UserProfile;

    // Goals
    goalKcal: number;
    goalMacros: Macro;

    // Current Day
    consumedKcal: number;
    consumedMacros: Macro;
    meals: Meal[];

    // Actions
    // Synchronization
    setProfile: (profile: UserProfile) => void;
    setMeals: (meals: Meal[]) => void;

    // Favorites
    favorites: Meal[];
    setFavorites: (favorites: Meal[]) => void;
    addFavorite: (meal: Meal) => void;

    // Actions
    updateProfile: (updates: Partial<UserProfile>) => void;
    addMeal: (meal: Meal) => void;
    removeMeal: (mealId: string) => void;
    resetDay: () => void;
}

export const useNutriStore = create<NutriState>((set) => ({
    profile: {
        gender: 'Male',
        age: 45,
        weight: 106.5,
        muscleMass: 76.6,
        bmr: 2025,
        goal: 'Recomposition corporelle'
    },
    goalKcal: 2025,
    goalMacros: { p: 180, c: 150, f: 75 },

    consumedKcal: 0,
    consumedMacros: { p: 0, c: 0, f: 0 },
    meals: [],
    favorites: [],

    setProfile: (profile) => set({ profile }),

    setMeals: (meals) => {
        const consumedKcal = meals.reduce((acc, current) => acc + current.totalKcal, 0);
        const consumedMacros = meals.reduce((acc, current) => ({
            p: acc.p + current.totalMacros.p,
            c: acc.c + current.totalMacros.c,
            f: acc.f + current.totalMacros.f,
        }), { p: 0, c: 0, f: 0 });

        set({ meals, consumedKcal, consumedMacros });
    },

    setFavorites: (favorites) => set({ favorites }),

    addFavorite: (meal) => set((state) => ({ favorites: [...state.favorites, meal] })),

    updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
    })),

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
