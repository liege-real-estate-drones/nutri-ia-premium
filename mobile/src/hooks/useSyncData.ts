import { useEffect, useState } from 'react';
import { useNutriStore } from '../store/useNutriStore';

const BACKEND_URL = 'https://nutri-ia-premium.vercel.app/api/db';

export function useSyncData() {
    const {
        profile, setProfile,
        meals, setMeals,
        favorites, setFavorites
    } = useNutriStore();

    const [isLoaded, setIsLoaded] = useState(false);

    // --- 1. CHARGEMENT INITIAL (GET) ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Profile
                const profileRes = await fetch(`${BACKEND_URL}/profile`);
                const profileData = await profileRes.json();
                if (profileData.success && profileData.profile) {
                    setProfile(profileData.profile);
                }

                // Fetch Meals (today)
                const today = new Date().toISOString().split('T')[0];
                const mealsRes = await fetch(`${BACKEND_URL}/meals?date=${today}`);
                const mealsData = await mealsRes.json();
                if (mealsData.success && mealsData.meals) {
                    setMeals(mealsData.meals);
                }

                // Fetch Favorites
                const favRes = await fetch(`${BACKEND_URL}/favorites`);
                const favData = await favRes.json();
                if (favData.success && favData.favorites) {
                    setFavorites(favData.favorites);
                }

                setIsLoaded(true);
                console.log('✅ Synchronisation cloud initiale réussie');
            } catch (error) {
                console.error('❌ Erreur de chargement initial KV:', error);
                // On laisse les données par défaut de Zustand en cas d'erreur (offline)
                setIsLoaded(true);
            }
        };

        loadInitialData();
    }, []); // Run once on mount

    // --- 2. SAUVEGARDE PROFILE (POST) ---
    useEffect(() => {
        if (!isLoaded) return;
        const saveProfile = async () => {
            try {
                await fetch(`${BACKEND_URL}/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile)
                });
            } catch (error) {
                console.error('❌ Echec sauvegarde profil:', error);
            }
        };
        saveProfile();
    }, [profile.weight, profile.muscleMass, profile.bmr, profile.goal]);

    // --- 3. SAUVEGARDE MEALS (POST) ---
    useEffect(() => {
        if (!isLoaded) return;
        const saveMeals = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                await fetch(`${BACKEND_URL}/meals`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ date: today, meals })
                });
            } catch (error) {
                console.error('❌ Echec sauvegarde repas:', error);
            }
        };
        saveMeals();
    }, [meals]);

    // --- 4. SAUVEGARDE FAVORITES (POST) ---
    useEffect(() => {
        if (!isLoaded) return;
        const saveFavorites = async () => {
            try {
                await fetch(`${BACKEND_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(favorites)
                });
            } catch (error) {
                console.error('❌ Echec sauvegarde favoris:', error);
            }
        };
        saveFavorites();
    }, [favorites]);

    return {
        isSynced: isLoaded
    };
}
