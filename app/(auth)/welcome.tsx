import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/components/colors';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to{'\n'}Trippo!</Text>
        <Text style={styles.subtitle}>Your AI-powered travel planning{'\n'}companion</Text>

        <Image
          source={{ uri: 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&cs=tinysrgb&w=300' }}
          style={styles.mascot}
        />

        <Text style={styles.message}>Let's create your perfect trip in just a few steps!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(auth)/sign-in')}
        >
          <Text style={styles.buttonText}>Start my adventure 🚀</Text>
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
    backgroundColor: colors.surfaceLight,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  mascot: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
