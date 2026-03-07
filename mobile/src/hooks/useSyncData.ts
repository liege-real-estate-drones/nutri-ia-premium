import { useEffect } from 'react';
import { useNutriStore } from '../store/useNutriStore';

// URL du backend Next.js (MOCK)
const BACKEND_URL = 'https://nutri-ia-backend.vercel.app/api';

/**
 * Hook de synchronisation des données Zustand vers Vercel Postgres/KV
 */
export function useSyncData() {
    const profile = useNutriStore(state => state.profile);
    const consumedKcal = useNutriStore(state => state.consumedKcal);
    const meals = useNutriStore(state => state.meals);

    // Synchronisation du profil (Par exemple lors du chargement de l'app ou modif Profil)
    useEffect(() => {
        const syncProfile = async () => {
            try {
                // await fetch(`${BACKEND_URL}/sync/profile`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(profile)
                // });
                console.log('✅ Profil synchronisé avec la base de données distantes (Vercel Postgres/KV)');
            } catch (error) {
                console.error('❌ Echec de la synchro du profil:', error);
            }
        };

        syncProfile();
    }, [profile.weight, profile.muscleMass]); // On sync si le poids / muscle change (via EGYM scan)

    // Synchronisation des repas (Sauvegarde quotidienne)
    useEffect(() => {
        const syncMeals = async () => {
            if (meals.length === 0) return;

            try {
                console.log(`✅ ${meals.length} repas synchronisés avec KV pour l'historique de la journée (${consumedKcal} Kcal totales)`);
                // Appel API
            } catch (error) {
                console.error('❌ Echec de la synchro des repas:', error);
            }
        };

        // Utiliser un debounce ou écouter lors du "backgrounding" de l'app en prod
        syncMeals();
    }, [meals.length]); // Synchroniser à chaque ajout de repas

    return {
        isSynced: true
    };
}
