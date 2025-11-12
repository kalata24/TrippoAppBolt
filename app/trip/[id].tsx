import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { colors } from '@/components/colors';
import { ArrowLeft, Clock, MapPin, TrendingUp, Bookmark } from 'lucide-react-native';

interface Activity {
  name: string;
  duration?: string;
  icon?: string;
}

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  duration?: string;
  distance?: string;
  steps?: string;
  mustVisit?: string;
}

interface TripData {
  id: string;
  destination: string;
  staying_period: number;
  name: string;
  age: number;
  itinerary: {
    days: DayItinerary[];
    topAttractions: Array<{ name: string; day: string }>;
    personalizedMessage: string;
  };
}

export default function TripDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTrip(data);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter(d => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Trip</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {trip.itinerary.days.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <TouchableOpacity
              style={styles.dayHeader}
              onPress={() => toggleDay(day.day)}
            >
              <Text style={styles.dayTitle}>Day {day.day}</Text>
              <Text style={styles.dayToggle}>
                {expandedDays.includes(day.day) ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedDays.includes(day.day) && (
              <View style={styles.dayContent}>
                <Text style={styles.daySubtitle}>{day.title}</Text>

                {day.activities.map((activity, index) => (
                  <View key={index} style={styles.activity}>
                    <View style={styles.activityDot} />
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}

                <View style={styles.stats}>
                  {day.duration && (
                    <View style={styles.stat}>
                      <Clock size={16} color={colors.primary} />
                      <Text style={styles.statText}>{day.duration}</Text>
                    </View>
                  )}
                  {day.distance && (
                    <View style={styles.stat}>
                      <MapPin size={16} color={colors.primary} />
                      <Text style={styles.statText}>{day.distance}</Text>
                    </View>
                  )}
                  {day.steps && (
                    <View style={styles.stat}>
                      <TrendingUp size={16} color={colors.primary} />
                      <Text style={styles.statText}>{day.steps}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.directionsButton}>
                  <MapPin size={16} color={colors.white} />
                  <Text style={styles.directionsText}>Get Directions for Day {day.day}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {trip.itinerary.topAttractions && trip.itinerary.topAttractions.length > 0 && (
          <View style={styles.attractionsCard}>
            <View style={styles.attractionsHeader}>
              <Text style={styles.attractionsEmoji}>⭐</Text>
              <Text style={styles.attractionsTitle}>Top 3 Must-Visit</Text>
            </View>
            <Text style={styles.attractionsSubtitle}>Don't miss these iconic attractions!</Text>

            {trip.itinerary.topAttractions.slice(0, 3).map((attraction, index) => (
              <View key={index} style={styles.attractionItem}>
                <View style={styles.attractionNumber}>
                  <Text style={styles.attractionNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.attractionContent}>
                  <Text style={styles.attractionName}>{attraction.name}</Text>
                  <Text style={styles.attractionDay}>📍 {attraction.day}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {trip.itinerary.personalizedMessage && (
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>Have an Amazing Trip, {trip.name}! 🎉</Text>
            <Text style={styles.messageText}>{trip.itinerary.personalizedMessage}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton}>
          <Bookmark size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>Save this trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: colors.surfaceLight,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  dayToggle: {
    fontSize: 16,
    color: colors.text,
  },
  dayContent: {
    padding: 16,
  },
  daySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  directionsText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  attractionsCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  attractionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  attractionsEmoji: {
    fontSize: 20,
  },
  attractionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  attractionsSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 16,
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  attractionNumber: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attractionNumberText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  attractionContent: {
    flex: 1,
  },
  attractionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  attractionDay: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  messageCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 40,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
