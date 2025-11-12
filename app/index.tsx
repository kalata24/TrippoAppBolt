import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B8D4C8' }}>
        <ActivityIndicator size="large" color="#F39C12" />
      </View>
    );
  }

  return <Redirect href={user ? "/(tabs)" : "/(auth)/welcome"} />;
}
