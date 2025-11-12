import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Sparkles, Plane } from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/components/colors';

export default function Organize() {
  const router = useRouter();
  const { user } = useAuth();

  const username = user?.user_metadata?.username || 'Traveler';

  const welcomeScale = useRef(new Animated.Value(0.9)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const infoFade = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(welcomeScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(infoFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View
          style={[
            styles.welcomeCard,
            {
              opacity: welcomeOpacity,
              transform: [{ scale: welcomeScale }],
            },
          ]}
        >
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>Welcome, {username}! </Text>
            <Sparkles size={24} color={colors.accent} />
          </View>
          <Text style={styles.welcomeMessage}>
            Ready to plan your next amazing adventure? Create a new trip or explore your existing ones.
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }, { scale: buttonPulse }],
          }}
        >
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(onboarding)/destination')}
            activeOpacity={0.8}
          >
            <Plane size={24} color={colors.white} />
            <Text style={styles.createButtonText}>Create New Trip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.infoCard, { opacity: infoFade }]}>
          <Text style={styles.infoTitle}>How it works ✨</Text>
          <Text style={styles.infoText}>
            1. Choose your destination{'\n'}
            2. Pick your preferences{'\n'}
            3. Let AI plan your perfect trip{'\n'}
            4. Enjoy your adventure!
          </Text>
        </Animated.View>
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
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  welcomeMessage: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.cream,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.accentLight,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 26,
    fontWeight: '500',
  },
});
