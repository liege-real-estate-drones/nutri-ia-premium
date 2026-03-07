import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Camera, Search, Clock, Flame } from 'lucide-react-native';
import { theme } from '../../src/theme';
import { useNutriStore } from '../../src/store/useNutriStore';

export default function FrigoScreen() {
    const { goalKcal, consumedKcal } = useNutriStore();
    const remainingKcal = Math.max(0, goalKcal - consumedKcal);

    const [ingredients, setIngredients] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recipes, setRecipes] = useState<any[]>([]);

    const handleGenerate = () => {
        setIsLoading(true);
        // Simulate AI generation based on remaining Kcal
        setTimeout(() => {
            setRecipes([
                { id: 1, title: 'Poulet rôti aux herbes', time: '25 min', kcal: 450 },
                { id: 2, title: 'Bowl de quinoa et avocats', time: '15 min', kcal: 380 }
            ]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Frigo Magique</Text>
                <Text style={styles.subtitle}>{remainingKcal} kcal restantes aujourd'hui</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Input Section */}
                <View style={styles.inputCard}>
                    <TouchableOpacity style={styles.scanButton} activeOpacity={0.8}>
                        <Camera color={theme.colors.surface} size={28} />
                        <Text style={styles.scanText}>Scanner le frigo</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>- OU -</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Que vous reste-t-il ? (ex: Poulet, Riz...)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={ingredients}
                            onChangeText={setIngredients}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleGenerate}>
                            <Search color={theme.colors.primary} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Results Section */}
                {isLoading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Création de vos recettes sur mesure...</Text>
                    </View>
                ) : (
                    recipes.length > 0 && (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.sectionTitle}>Recettes Suggérées</Text>
                            {recipes.map((recipe) => (
                                <View key={recipe.id} style={styles.recipeCard}>
                                    <View style={styles.recipeInfo}>
                                        <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                        <View style={styles.recipeTags}>
                                            <View style={styles.tag}>
                                                <Flame size={14} color={theme.colors.danger} />
                                                <Text style={styles.tagText}>{recipe.kcal} Kcal</Text>
                                            </View>
                                            <View style={styles.tag}>
                                                <Clock size={14} color={theme.colors.textSecondary} />
                                                <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{recipe.time}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.viewRecipeBtn}>
                                        <Text style={styles.viewRecipeText}>Voir</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )
                )}
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
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: theme.colors.surface,
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.xl,
        fontWeight: 'bold',
    },
    subtitle: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: '600',
        marginTop: 4,
    },
    content: {
        padding: 24,
    },
    inputCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
        marginBottom: 32,
    },
    scanButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    scanText: {
        color: theme.colors.surface,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginVertical: 16,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness.md,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
        paddingHorizontal: 12,
    },
    textInput: {
        flex: 1,
        color: theme.colors.text,
        paddingVertical: 14,
        fontSize: theme.typography.sizes.md,
    },
    searchButton: {
        padding: 8,
    },
    loader: {
        alignItems: 'center',
        marginTop: 40,
    },
    loadingText: {
        color: theme.colors.textSecondary,
        marginTop: 16,
        fontSize: theme.typography.sizes.sm,
    },
    resultsContainer: {
        marginBottom: 40,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    recipeCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    recipeInfo: {
        flex: 1,
    },
    recipeTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        fontWeight: '600',
        marginBottom: 8,
    },
    recipeTags: {
        flexDirection: 'row',
        gap: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tagText: {
        color: theme.colors.danger,
        fontSize: theme.typography.sizes.sm,
        fontWeight: '500',
    },
    viewRecipeBtn: {
        backgroundColor: theme.colors.surfaceHighlight,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: theme.roundness.md,
    },
    viewRecipeText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.typography.sizes.sm,
    }
});
