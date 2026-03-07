import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Activity, Scale, Dumbbell, Flame, TrendingDown, ScanLine } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { useNutriStore } from '../../src/store/useNutriStore';

export default function ProfilScreen() {
    const profile = useNutriStore((state) => state.profile);
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Santé & Métabolisme</Text>

            <View style={styles.bentoGrid}>
                {/* Ligne 1 : Poids et Muscle */}
                <View style={styles.row}>
                    <BentoCard
                        title="Poids"
                        value={`${profile.weight} kg`}
                        icon={<Scale color={theme.colors.primary} size={24} />}
                        flex={1}
                    />
                    <BentoCard
                        title="Masse Muscu."
                        value={`${profile.muscleMass} kg`}
                        icon={<Dumbbell color={theme.colors.protein} size={24} />}
                        flex={1}
                    />
                </View>

                {/* Ligne 2 : TMB et Objectif */}
                <View style={styles.row}>
                    <BentoCard
                        title="TMB (EGYM)"
                        value={`${profile.bmr} kcal`}
                        icon={<Flame color={theme.colors.danger} size={24} />}
                        flex={1.2}
                    />
                    <BentoCard
                        title="Objectif"
                        value="Recomposition"
                        subtitle="Perte de gras"
                        icon={<Activity color={theme.colors.success} size={24} />}
                        flex={0.8}
                    />
                </View>

                {/* Tendance Visuelle (Placeholder Curve) */}
                <View style={[styles.card, styles.trendCard]}>
                    <View style={styles.cardHeader}>
                        <TrendingDown color={theme.colors.textSecondary} size={20} />
                        <Text style={styles.cardTitle}>Tendance Poids (30j)</Text>
                    </View>
                    <View style={styles.mockCurveContainer}>
                        {/* Placeholder pour une vraie courbe SVG Reanimated */}
                        <View style={styles.mockCurve} />
                        <Text style={styles.trendValue}>-1.2 kg</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionButtonsContainer}>
                {/* Bouton Scan EGYM */}
                <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
                    <ScanLine color={theme.colors.background} size={20} />
                    <Text style={styles.primaryButtonText}>Mettre à jour via Scan</Text>
                </TouchableOpacity>

                {/* Bouton Favoris */}
                <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={() => router.push('/favoris' as any)}>
                    <Text style={styles.secondaryButtonText}>Mes Repas Favoris</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

// Composant Helper pour les tuiles Bento
function BentoCard({ title, value, subtitle, icon, flex = 1 }: any) {
    return (
        <View style={[styles.card, { flex }]}>
            <View style={styles.cardHeader}>
                {icon}
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Text style={styles.cardValue}>{value}</Text>
            {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 24,
        paddingTop: 60, // Safe Area
        paddingBottom: 40,
    },
    headerTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 24,
    },
    bentoGrid: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: 20,
        // Glossy look / border for OLED dark mode 
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    cardTitle: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: '600',
    },
    cardValue: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.xl,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        color: theme.colors.success,
        fontSize: theme.typography.sizes.xs,
        marginTop: 4,
        fontWeight: '500',
    },
    trendCard: {
        marginTop: 0,
    },
    mockCurveContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    mockCurve: {
        flex: 1,
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.success,
        borderRightWidth: 2,
        borderRightColor: theme.colors.success,
        borderBottomRightRadius: 40,
        opacity: 0.5,
        marginRight: 16,
    },
    trendValue: {
        color: theme.colors.success,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
        marginBottom: -4,
    },
    actionButtonsContainer: {
        marginTop: 32,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    primaryButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.full,
        borderWidth: 2,
        borderColor: theme.colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    secondaryButtonText: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
    }
});
