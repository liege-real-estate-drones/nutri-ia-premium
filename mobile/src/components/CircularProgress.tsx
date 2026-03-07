import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { theme } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    currentKcal: number;
    goalKcal: number;
    size?: number;
    strokeWidth?: number;
}

export default function CircularProgress({
    currentKcal,
    goalKcal,
    size = 200,
    strokeWidth = 15,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const progress = useSharedValue(0);

    useEffect(() => {
        // Animate progress on mount or update
        const targetProgress = Math.min(Math.max(currentKcal / goalKcal, 0), 1);
        progress.value = withSpring(targetProgress, {
            mass: 1,
            damping: 20,
            stiffness: 90,
        });
    }, [currentKcal, goalKcal]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - circumference * progress.value;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke={theme.colors.surfaceHighlight}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Foreground Animated Circle */}
                <AnimatedCircle
                    stroke={theme.colors.primary}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={styles.currentText}>{currentKcal.toFixed(0)}</Text>
                <Text style={styles.goalText}>/ {goalKcal} Kcal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentText: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.xxl,
        fontWeight: 'bold',
        fontFamily: theme.typography.fontFamily,
    },
    goalText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.typography.fontFamily,
        marginTop: 4,
    },
});
