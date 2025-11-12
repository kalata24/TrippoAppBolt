import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/components/colors';

export default function Organize() {
  const router = useRouter();
  const { user } = useAuth();

  const username = user?.user_metadata?.username || 'Traveler';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, {username}! 🎉</Text>
          <Text style={styles.welcomeMessage}>
            Ready to plan your next amazing adventure? Create a new trip or explore your existing ones.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/(onboarding)/destination')}
        >
          <Text style={styles.createButtonEmoji}>✈️</Text>
          <Text style={styles.createButtonText}>Create New Trip</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            1. Choose your destination{'\n'}
            2. Pick your preferences{'\n'}
            3. Let AI plan your perfect trip{'\n'}
            4. Enjoy your adventure!
          </Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  createButtonEmoji: {
    fontSize: 24,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
  },
});
