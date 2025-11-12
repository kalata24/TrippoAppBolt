import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';
import { Heart } from 'lucide-react-native';

const TRAITS = ['Adventurer⛺', 'Foodie🍰', 'Art Lover🎨', 'Photographer📸', 'Concert Lover🎵', 'Sports Fan⚽'];

export default function Personality() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (trait: string) => {
    if (selected.includes(trait)) {
      setSelected(selected.filter(t => t !== trait));
    } else if (selected.length < 3) {
      setSelected([...selected, trait]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    router.push({
      pathname: '/(onboarding)/info',
      params: {
        ...params,
        personalities: JSON.stringify(selected),
      },
    });
  };

  const isLocalCultureSelected = selected.includes('Local Culture');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 3 of 5</Text>
        <Text style={styles.title}>What describes you best?</Text>
        <Text style={styles.subtitle}>Select up to 3</Text>

        <TouchableOpacity
          style={[
            styles.specialItem,
            isLocalCultureSelected && styles.specialItemSelected
          ]}
          onPress={() => toggle('Local Culture')}
        >
          <View style={styles.specialContent}>
            <Heart size={24} color={isLocalCultureSelected ? colors.accent : colors.primary} fill={isLocalCultureSelected ? colors.accent : 'transparent'} />
            <Text style={[styles.specialText, isLocalCultureSelected && styles.specialTextSelected]}>
              Local Culture
            </Text>
            <Text style={styles.specialSubtext}>Experience authentic traditions</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          {TRAITS.map((trait, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.item, selected.includes(trait) && styles.itemSelected]}
              onPress={() => toggle(trait)}
            >
              <Text style={styles.itemText}>{trait}</Text>
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
    paddingBottom: 100,
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
  specialItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  specialItemSelected: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
  },
  specialContent: {
    alignItems: 'center',
    gap: 8,
  },
  specialText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  specialTextSelected: {
    color: colors.accent,
  },
  specialSubtext: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
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
