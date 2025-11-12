import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';

export default function Destination() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [stayingPeriod, setStayingPeriod] = useState('');

  const handleContinue = () => {
    if (!destination || !stayingPeriod) return;

    const period = parseInt(stayingPeriod);
    if (period < 1 || period > 30) return;

    router.push({
      pathname: '/(onboarding)/food',
      params: { destination, stayingPeriod },
    });
  };

  const isValid = destination && stayingPeriod && parseInt(stayingPeriod) >= 1 && parseInt(stayingPeriod) <= 30;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 1 of 5</Text>
        <Text style={styles.title}>Pick a destination{'\n'}and staying period</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Paris, France"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Staying Period (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="5"
            value={stayingPeriod}
            onChangeText={setStayingPeriod}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Maximum 30 days</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
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
    marginBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
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
