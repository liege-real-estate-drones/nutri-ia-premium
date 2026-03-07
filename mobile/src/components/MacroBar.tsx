import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { theme } from '../theme';

interface MacroBarProps {
    label: string;
    current: number;
    goal: number;
    color: string;
}

export default function MacroBar({ label, current, goal, color }: MacroBarProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        const targetProgress = Math.min(Math.max(current / goal, 0), 1);
        progress.value = withSpring(targetProgress * 100, {
            mass: 0.5,
            damping: 15,
            stiffness: 100,
        });
    }, [current, goal]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
            backgroundColor: color,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                    {current.toFixed(0)} / {goal}g
                </Text>
            </View>
            <View style={styles.barBackground}>
                <Animated.View style={[styles.barFill, animatedStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: '500',
        fontFamily: theme.typography.fontFamily,
    },
    value: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.sm,
        fontWeight: '500',
        fontFamily: theme.typography.fontFamily,
    },
    barBackground: {
        height: 8,
        backgroundColor: theme.colors.surfaceHighlight,
        borderRadius: theme.roundness.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: theme.roundness.full,
    },
});
