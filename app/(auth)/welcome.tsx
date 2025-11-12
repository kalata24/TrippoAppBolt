import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/components/colors';
import { Plane } from 'lucide-react-native';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to{'\n'}Trippo!</Text>
        <Text style={styles.subtitle}>Your AI-powered travel planning companion</Text>

        <View style={styles.mascotContainer}>
          <View style={styles.mascotCircle}>
            <Text style={styles.mascotEmoji}>🦖</Text>
          </View>
          <View style={styles.sparkle1}>
            <Text style={styles.sparkleText}>✨</Text>
          </View>
          <View style={styles.sparkle2}>
            <Text style={styles.sparkleText}>✨</Text>
          </View>
        </View>

        <Text style={styles.message}>Let's create your perfect trip in just a few steps!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(auth)/sign-in')}
        >
          <Text style={styles.buttonText}>Start my adventure </Text>
          <Plane size={20} color={colors.white} style={{ transform: [{ rotate: '45deg' }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 380,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  mascotContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.success + '40',
  },
  mascotEmoji: {
    fontSize: 100,
  },
  sparkle1: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: 15,
  },
  sparkleText: {
    fontSize: 24,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});
