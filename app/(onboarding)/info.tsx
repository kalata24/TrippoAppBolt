import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';

export default function Info() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  const handleContinue = () => {
    if (!name || !age || !location) return;

    router.push({
      pathname: '/(onboarding)/processing',
      params: {
        ...params,
        name,
        age,
        location,
      },
    });
  };

  const isValid = name && age && location;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 4 of 5</Text>
        <Text style={styles.title}>Enter your information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>😊 Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Alex"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>🎂 Age</Text>
          <TextInput
            style={styles.input}
            placeholder="32"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>📍 Current Location</Text>
          <TextInput
            style={styles.input}
            placeholder="New York, USA"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Organize my trip</Text>
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
