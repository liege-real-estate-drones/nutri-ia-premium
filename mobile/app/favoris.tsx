import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme';
import { useNutriStore } from '../src/store/useNutriStore';

const CATEGORIES = ['Tous', 'Petit-déjeuner', 'Déjeuner', '16h', 'Dîner'];

const MOCK_FAVORITES = [
    {
        id: 'f1',
        name: 'Omelette (3 œufs) & Pain complet',
        category: 'Petit-déjeuner',
        totalKcal: 380,
        totalMacros: { p: 25, c: 30, f: 18 },
        ingredients: []
    },
    {
        id: 'f2',
        name: 'Whey Isolate & Banane',
        category: '16h',
        totalKcal: 215,
        totalMacros: { p: 26, c: 27, f: 1 },
        ingredients: []
    },
    {
        id: 'f3',
        name: 'Poulet, Riz basmati & Brocolis',
        category: 'Déjeuner',
        totalKcal: 450,
        totalMacros: { p: 45, c: 50, f: 8 },
        ingredients: []
    },
    {
        id: 'f4',
        name: 'Saumon grillé & Quinoa',
        category: 'Dîner',
        totalKcal: 520,
        totalMacros: { p: 40, c: 35, f: 24 },
        ingredients: []
    }
];

export default function FavorisScreen() {
    const router = useRouter();
    const addMeal = useNutriStore(state => state.addMeal);
    const [activeCategory, setActiveCategory] = useState('Tous');

    const filteredFavorites = activeCategory === 'Tous'
        ? MOCK_FAVORITES
        : MOCK_FAVORITES.filter(f => f.category === activeCategory);

    const handleAddFavorite = (meal: any) => {
        addMeal({
            ...meal,
            id: Date.now().toString(), // new instance for the day
            date: new Date().toISOString()
        });
        // Feedback visuel ou router.back()
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color={theme.colors.text} size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favoris & Routines</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Chips Profil & Routines */}
            <View style={styles.chipsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.chip, activeCategory === cat && styles.chipActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Liste des favoris */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {filteredFavorites.map(fav => (
                    <View key={fav.id} style={styles.card}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardCategory}>{fav.category}</Text>
                            <Text style={styles.cardTitle}>{fav.name}</Text>
                            <View style={styles.macrosRow}>
                                <Text style={styles.macroText}>{fav.totalKcal} kcal</Text>
                                <Text style={styles.macroDetails}>P:{fav.totalMacros.p} G:{fav.totalMacros.c} L:{fav.totalMacros.f}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFavorite(fav)}>
                            <Plus color={theme.colors.surface} size={24} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: theme.colors.surface,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
    },
    chipsWrapper: {
        backgroundColor: theme.colors.surface,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceHighlight,
    },
    chipsContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: theme.roundness.full,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    chipTextActive: {
        color: theme.colors.surface,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    cardInfo: {
        flex: 1,
    },
    cardCategory: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.xs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    macrosRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    macroText: {
        color: theme.colors.danger,
        fontWeight: 'bold',
        fontSize: theme.typography.sizes.sm,
    },
    macroDetails: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.sm,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    }
});
