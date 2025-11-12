import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/components/colors';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Your trip statistics and insights will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
