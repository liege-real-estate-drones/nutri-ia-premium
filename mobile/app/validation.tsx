import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Minus, Check, X } from 'lucide-react-native';
import { theme } from '../src/theme';
import { useNutriStore, Meal, Ingredient } from '../src/store/useNutriStore';

// We pass meal stringified via params from Dashboard
export default function ValidationScreen() {
    const router = useRouter();
    const { addMeal } = useNutriStore();
    const params = useLocalSearchParams();

    // Parse passed meal or use fallback mockup if navigated directly for testing
    const initialMeal: Meal = params.meal
        ? JSON.parse(params.meal as string)
        : {
            id: Math.random().toString(),
            name: "Poulet Teriyaki & Riz",
            ingredients: [
                { id: "1", name: "Poulet", weight: 150, kcal: 240, macros: { p: 45, c: 0, f: 5 } },
                { id: "2", name: "Riz blanc", weight: 100, kcal: 130, macros: { p: 2, c: 28, f: 0 } },
                { id: "3", name: "Sauce Teriyaki", weight: 30, kcal: 45, macros: { p: 1, c: 10, f: 0 } }
            ],
            totalKcal: 415,
            totalMacros: { p: 48, c: 38, f: 5 },
            date: new Date().toISOString()
        };

    const [meal, setMeal] = useState<Meal>(initialMeal);

    const updateIngredientWeight = (ingredientId: string, increment: boolean) => {
        setMeal(prev => {
            const updatedIngredients = prev.ingredients.map(ing => {
                if (ing.id === ingredientId) {
                    const newWeight = Math.max(0, increment ? ing.weight + 10 : ing.weight - 10);
                    const ratio = newWeight / ing.weight;

                    return {
                        ...ing,
                        weight: newWeight,
                        kcal: Math.round(ing.kcal * ratio),
                        macros: {
                            p: Math.round(ing.macros.p * ratio),
                            c: Math.round(ing.macros.c * ratio),
                            f: Math.round(ing.macros.f * ratio),
                        }
                    };
                }
                return ing;
            });

            // Recalculate totals
            const totalKcal = updatedIngredients.reduce((sum, ing) => sum + ing.kcal, 0);
            const totalMacros = updatedIngredients.reduce((acc, ing) => ({
                p: acc.p + ing.macros.p,
                c: acc.c + ing.macros.c,
                f: acc.f + ing.macros.f,
            }), { p: 0, c: 0, f: 0 });

            return {
                ...prev,
                ingredients: updatedIngredients,
                totalKcal,
                totalMacros
            };
        });
    };

    const handleValidate = () => {
        addMeal(meal);
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <X color={theme.colors.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Validation du Repas</Text>
                <TouchableOpacity onPress={handleValidate} style={styles.iconButtonPrimary}>
                    <Check color={theme.colors.surface} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Placeholder for scanned image if we had one */}
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>🍽️ {meal.name}</Text>
                </View>

                {/* Totals Card */}
                <View style={styles.totalsCard}>
                    <Text style={styles.totalsKcal}>{meal.totalKcal} Kcal</Text>
                    <View style={styles.macrosRow}>
                        <Text style={[styles.macroText, { color: theme.colors.protein }]}>P: {meal.totalMacros.p}g</Text>
                        <Text style={[styles.macroText, { color: theme.colors.carbs }]}>G: {meal.totalMacros.c}g</Text>
                        <Text style={[styles.macroText, { color: theme.colors.fat }]}>L: {meal.totalMacros.f}g</Text>
                    </View>
                </View>

                {/* Ingredients List */}
                <Text style={styles.sectionTitle}>Ingrédients détectés</Text>
                {meal.ingredients.map(ing => (
                    <View key={ing.id} style={styles.ingredientCard}>
                        <View style={styles.ingredientInfo}>
                            <Text style={styles.ingredientName}>{ing.name}</Text>
                            <Text style={styles.ingredientKcal}>{ing.kcal} Kcal</Text>
                        </View>

                        {/* Stepper */}
                        <View style={styles.stepperContainer}>
                            <TouchableOpacity
                                style={styles.stepperButton}
                                onPress={() => updateIngredientWeight(ing.id, false)}
                            >
                                <Minus size={20} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.stepperValue}>{ing.weight}g</Text>
                            <TouchableOpacity
                                style={styles.stepperButton}
                                onPress={() => updateIngredientWeight(ing.id, true)}
                            >
                                <Plus size={20} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
                    <Text style={styles.validateButtonText}>Valider et Ajouter</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 8,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.roundness.full,
    },
    iconButtonPrimary: {
        padding: 8,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.full,
    },
    content: {
        padding: 20,
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.roundness.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    imageText: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
    },
    totalsCard: {
        backgroundColor: theme.colors.surface,
        padding: 24,
        borderRadius: theme.roundness.lg,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    totalsKcal: {
        color: theme.colors.primary,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    macrosRow: {
        flexDirection: 'row',
        gap: 20,
    },
    macroText: {
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ingredientCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.md,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ingredientKcal: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.sm,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness.full,
        padding: 4,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    stepperButton: {
        padding: 8,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.roundness.full,
    },
    stepperValue: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
    },
    validateButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: theme.roundness.full,
        alignItems: 'center',
        marginTop: 24,
    },
    validateButtonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
    }
});
