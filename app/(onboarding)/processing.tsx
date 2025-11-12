import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateTripPlan } from '@/lib/openai';
import { colors } from '@/components/colors';

export default function Processing() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    processTrip();
  }, []);

  const processTrip = async () => {
    try {
      const foods = JSON.parse(params.foods as string);
      const personalities = JSON.parse(params.personalities as string);

      const itinerary = await generateTripPlan(
        params.destination as string,
        parseInt(params.stayingPeriod as string),
        params.startDate as string,
        params.endDate as string,
        foods,
        personalities,
        params.name as string,
        parseInt(params.age as string),
        params.location as string,
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: trip, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          destination: params.destination as string,
          staying_period: parseInt(params.stayingPeriod as string),
          name: params.name as string,
          age: parseInt(params.age as string),
          current_location: params.location as string,
          start_date: params.startDate as string,
          end_date: params.endDate as string,
          itinerary: itinerary,
          is_saved: false,
          status: 'upcoming',
        })
        .select()
        .single();

      if (error) throw error;

      router.replace(`/trip/${trip.id}`);
    } catch (error) {
      console.error('Error processing trip:', error);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 5 of 5</Text>
        <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
        <Text style={styles.title}>Creating Your Perfect Trip!</Text>
        <Text style={styles.message}>Trippo is planning amazing places for you...</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  step: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 32,
  },
  loader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
