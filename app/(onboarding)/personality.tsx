import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';
import { Heart } from 'lucide-react-native';
import StepProgress from '@/components/StepProgress';

const TRAITS = [
  { name: 'Adventurer', emoji: '⛺' },
  { name: 'Foodie', emoji: '🍰' },
  { name: 'Art Lover', emoji: '🎨' },
  { name: 'Photographer', emoji: '📸' },
  { name: 'Concert Lover', emoji: '🎵' },
  { name: 'Sports Fan', emoji: '⚽' },
];

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
    <View style={styles.container}>
      <View style={styles.header}>
        <StepProgress
          currentStep={3}
          totalSteps={5}
          steps={['Destination', 'Food', 'Personality', 'Your Info', 'Your Trip']}
        />
      </View>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>What describes you best?</Text>
          <Text style={styles.subtitle}>Select up to 3</Text>

          <View style={styles.grid}>
            {TRAITS.map((trait, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.traitCard, selected.includes(trait.name) && styles.traitCardSelected]}
                onPress={() => toggle(trait.name)}
              >
                <Text style={styles.traitEmoji}>{trait.emoji}</Text>
                <Text style={styles.traitName}>{trait.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.specialItem,
              isLocalCultureSelected && styles.specialItemSelected
            ]}
            onPress={() => toggle('Local Culture')}
          >
            <Heart size={28} color={isLocalCultureSelected ? colors.white : colors.pink} fill={isLocalCultureSelected ? colors.white : colors.pink} />
            <Text style={[styles.specialText, isLocalCultureSelected && styles.specialTextSelected]}>
              Local Culture
            </Text>
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
  traitCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  traitCardSelected: {
    borderColor: colors.borderOrange,
    backgroundColor: colors.surfaceLight,
  },
  traitEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  traitName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  specialItem: {
    backgroundColor: colors.pink,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  specialItemSelected: {
    backgroundColor: colors.accent,
  },
  specialText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  specialTextSelected: {
    color: colors.white,
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
