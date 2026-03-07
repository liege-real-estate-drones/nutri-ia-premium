import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useNutriStore } from '../../src/store/useNutriStore';
import { useAI } from '../../src/hooks/useAI';
import { theme } from '../../src/theme';
import CircularProgress from '../../src/components/CircularProgress';
import MacroBar from '../../src/components/MacroBar';

export default function DashboardScreen() {
  const router = useRouter();
  const { consumedKcal, goalKcal, consumedMacros, goalMacros, addMeal } = useNutriStore();
  const { isAnalyzing, scanPlate } = useAI();
  const [loading, setLoading] = useState(false);

  const handleScanPlate = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin de la permission de la caméra pour scanner votre repas.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      // Simulate sending to AI
      const mockResult = await scanPlate(result.assets[0].uri);

      // Navigate to Validation Screen (pass data via store or params usually, here we mock adding directly or navigate)
      // For now, let's just add it to the store to see the gauges move as requested.
      if (mockResult) {
        // Send to Validation Screen
        router.push({
          pathname: '/validation',
          params: { meal: JSON.stringify(mockResult) }
        });
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Bonjour, Thibault 👋</Text>

      {/* Kcal Circle */}
      <View style={styles.circleContainer}>
        <CircularProgress currentKcal={consumedKcal} goalKcal={goalKcal} size={220} strokeWidth={18} />
      </View>

      {/* Macros */}
      <View style={styles.macrosContainer}>
        <MacroBar label="Protéines" current={consumedMacros.p} goal={goalMacros.p} color={theme.colors.protein} />
        <MacroBar label="Glucides" current={consumedMacros.c} goal={goalMacros.c} color={theme.colors.carbs} />
        <MacroBar label="Lipides" current={consumedMacros.f} goal={goalMacros.f} color={theme.colors.fat} />
      </View>

      {/* FAB Camera */}
      <TouchableOpacity style={styles.fab} onPress={handleScanPlate} activeOpacity={0.8} disabled={loading || isAnalyzing}>
        {loading || isAnalyzing ? (
          <ActivityIndicator color={theme.colors.surface} />
        ) : (
          <Camera size={28} color={theme.colors.surface} />
        )}
      </TouchableOpacity>

      {/* Loading Overlay text if needed */}
      {(loading || isAnalyzing) && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>L'IA analyse votre assiette...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
    paddingTop: 60, // approximate safe area
  },
  greeting: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
    marginBottom: 32,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  macrosContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: theme.roundness.lg,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.roundness.full,
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  }
});
