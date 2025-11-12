import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';

const FOODS = ['Burger🍔', 'Pizza🍕', 'Pasta🍝', 'Sushi🍣', 'Steak🥩', 'Ramen🍜'];

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 2 of 5</Text>
        <Text style={styles.title}>Pick your favorite foods</Text>
        <Text style={styles.subtitle}>Select up to 3</Text>

        <View style={styles.grid}>
          {FOODS.map((food, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.item, selected.includes(food) && styles.itemSelected]}
              onPress={() => toggle(food)}
            >
              <Text style={styles.itemText}>{food}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  step: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 8,
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
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  item: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceLight,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
