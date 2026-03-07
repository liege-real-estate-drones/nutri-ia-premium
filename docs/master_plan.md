# CAHIER DES CHARGES COMPLET "NUTRI-IA PREMIUM"

## 1. VISION ET CONTEXTE UTILISATEUR
"Nutri-IA Premium" est une application mobile privée (Friends & Family) de suivi nutritionnel et métabolique propulsée par l'IA.
Le profil de base (Hardcodé pour l'initialisation) : Homme, 45 ans, 106.5 kg. Excellente masse musculaire (76.6 kg), TMB très élevé (2025 kcal). Objectif : Recomposition corporelle (perte de masse grasse viscérale, amélioration du VO2max, maintien strict de la masse musculaire).

## 2. ARCHITECTURE TECHNIQUE GLOBALE
*   **Monorepo Git** : Séparation stricte `/mobile` et `/backend`.
*   **Frontend (/mobile)** : React Native avec Expo, Expo Router (Bottom Tabs), TypeScript.
*   **State Management** : Zustand (réactivité instantanée pour les jauges).
*   **Animations & UI** : react-native-reanimated, react-native-svg pour des jauges à 60fps. Thème Dark Mode premium (fonds noirs/gris très foncés, effets glassmorphism discrets, couleurs d'accentuation vives pour les datas). Rendu "Pixel Perfect" basé sur les designs générés via StitchMCP.
*   **Backend (/backend)** : Next.js / Vercel Serverless Functions. TOUTES les clés API (OpenAI/Gemini) sont sécurisées ici. L'app mobile n'embarque aucun secret.
*   **Database** : Vercel Postgres ou KV pour stocker les profils, l'historique de poids, et les favoris.

## 3. LE CERVEAU DE L'APP : LE ROUTEUR IA (Backend)
L'application possède un bouton central (Appareil photo). L'image envoyée au backend `/api/smart-scan` est analysée par un LLM multimodal avec un prompt système strict qui route l'image selon deux cas :
*   **Cas A (Mode Stats)** : Si c'est une capture EGYM/BioAge -> Extraction JSON (TMB, Poids, Masse Grasse, etc.) -> Mise à jour du profil.
*   **Cas B (Mode Food)** : Si c'est une assiette/emballage -> Extraction JSON (Ingrédients, portions estimées, Macros) -> Renvoi vers l'écran de Validation.

## 4. FONCTIONNALITÉS ET ÉCRANS (UI/UX)
*   **Écran 1 : Dashboard (Accueil)**
    *   Header : "Bonjour [Nom]", date du jour.
    *   UI Centrale : Grand anneau CircularProgress affichant les Kcal consommées vs restantes.
    *   Trident Macros : 3 ProgressBar horizontales (Protéines, Glucides, Lipides) calculées dynamiquement selon le TMB et l'objectif.
    *   Action : Gros FAB (Floating Action Button) central pour la caméra.
*   **Écran 2 : Validation de l'Assiette (Le plus critique)**
    *   Post-scan d'un repas. Affiche la photo recadrée en haut.
    *   Liste des aliments sous forme de "Cards".
    *   Interactivité clé : Chaque Card possède un Stepper (+ et -). Si l'utilisateur ajuste les grammes, les Kcal et Macros de la Card ET le total global du repas se recalculent en temps réel via Zustand avant la validation finale.
    *   Bouton "Valider le repas" -> Ajoute au compteur du jour.
*   **Écran 3 : Le Frigo Magique (Générateur de recettes)**
    *   Split screen : Bouton pour scanner le frigo en photo + Champ texte/micro ("Il me reste du poulet et du riz").
    *   Logique IA : Le backend croise les ingrédients avec les macros restantes de la journée de l'utilisateur pour proposer 2 recettes adaptées.
    *   Résultat : Cards de recettes (Titre, Kcal, Temps, Bouton pour voir les étapes).
*   **Écran 4 : Favoris & Routines**
    *   Navigation par filtres horizontaux (Chips : Tous, Déjeuner, Dîner, 10h, 16h).
    *   Liste des repas enregistrés.
    *   Bouton "+" rapide sur chaque Card pour ajouter le repas au Dashboard du jour instantanément.
*   **Écran 5 : Coach IA (Chat Contextuel)**
    *   Interface type iMessage.
    *   L'IA a le contexte du store Zustand (elle sait ce que l'utilisateur a mangé, son TMB, ses objectifs).
    *   Input texte + micro + envoi de photo.
*   **Écran 6 : Profil & Santé (Bento Design)**
    *   Grille de Cards affichant les données EGYM extraites (TMB, Poids, % Grasse, Muscle).
    *   Mini-courbe de tendance du poids.
    *   Bouton "Mettre à jour via scan EGYM".
