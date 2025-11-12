import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';
import { Globe } from 'lucide-react-native';
import StepProgress from '@/components/StepProgress';

const FOODS = [
  { name: 'Burger', emoji: '🍔' },
  { name: 'Hot Dog', emoji: '🌭' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Steak', emoji: '🥩' },
  { name: 'Ramen', emoji: '🍜' },
  { name: 'Sushi', emoji: '🍣' },
  { name: 'Salad', emoji: '🥗' },
  { name: 'Dessert', emoji: '🍰' },
];

export default function Food() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (food: string) => {
    if (selected.includes(food)) {
      setSelected(selected.filter(f => f !== food));
    } else if (selected.length < 3) {
      setSelected([...selected, food]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    router.push({
      pathname: '/(onboarding)/personality',
      params: {
        ...params,
        foods: JSON.stringify(selected),
      },
    });
  };

  const isLocalFoodSelected = selected.includes('Local Food');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StepProgress
          currentStep={2}
          totalSteps={5}
          steps={['Destination', 'Food', 'Personality', 'Your Info', 'Your Trip']}
        />
      </View>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Pick your favorite foods</Text>
          <Text style={styles.subtitle}>Select up to 3</Text>

          <View style={styles.grid}>
            {FOODS.map((food, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.foodCard, selected.includes(food.name) && styles.foodCardSelected]}
                onPress={() => toggle(food.name)}
              >
                <Text style={styles.foodEmoji}>{food.emoji}</Text>
                <Text style={styles.foodName}>{food.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.localFoodCard,
              isLocalFoodSelected && styles.localFoodCardSelected
            ]}
            onPress={() => toggle('Local Food')}
          >
            <Text style={styles.localFoodEmoji}>🌍</Text>
            <Text style={styles.localFoodName}>Local Food</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={selected.length === 0}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    margin: 20,
    marginTop: 0,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  foodCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodCardSelected: {
    borderColor: colors.borderOrange,
    backgroundColor: colors.surfaceLight,
  },
  foodEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  foodName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  localFoodCard: {
    width: '100%',
    backgroundColor: colors.accentYellow,
    borderColor: colors.accentYellow,
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  localFoodCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  localFoodEmoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  localFoodName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flex: 2,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
