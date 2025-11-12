import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { colors } from '@/components/colors';
import { ArrowLeft, Clock, MapPin, Footprints, Navigation, Star } from 'lucide-react-native';
import StepProgress from '@/components/StepProgress';

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
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.destination}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {trip.itinerary.days.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <TouchableOpacity
              style={styles.dayHeader}
              onPress={() => toggleDay(day.day)}
            >
              <View style={styles.dayHeaderLeft}>
                <Text style={styles.dayTitle}>Day {day.day}</Text>
                <Text style={styles.tapHint}>Tap a card to expand</Text>
              </View>
              <Text style={styles.dayToggle}>
                {expandedDays.includes(day.day) ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedDays.includes(day.day) && (
              <View style={styles.dayContent}>
                <Text style={styles.daySubtitle}>{day.title}</Text>

                {day.activities.map((activity, index) => (
                  <View key={index} style={styles.activity}>
                    <View style={styles.activityIcon}>
                      <Text style={styles.activityEmoji}>{getActivityEmoji(activity)}</Text>
                    </View>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}

                <View style={styles.statsRow}>
                  {day.duration && (
                    <View style={styles.statBadge}>
                      <Clock size={14} color={colors.text} />
                      <Text style={styles.statBadgeText}>{day.duration}</Text>
                    </View>
                  )}
                  {day.distance && (
                    <View style={styles.statBadge}>
                      <MapPin size={14} color={colors.text} />
                      <Text style={styles.statBadgeText}>{day.distance}</Text>
                    </View>
                  )}
                  {day.steps && (
                    <View style={styles.statBadge}>
                      <Footprints size={14} color={colors.text} />
                      <Text style={styles.statBadgeText}>{day.steps}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.directionsButton}>
                  <Navigation size={16} color={colors.white} />
                  <Text style={styles.directionsText}>Get Directions for Day {day.day}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {trip.itinerary.topAttractions && trip.itinerary.topAttractions.length > 0 && (
          <View style={styles.attractionsCard}>
            <View style={styles.attractionsHeader}>
              <Star size={20} color={colors.accentYellow} fill={colors.accentYellow} />
              <Text style={styles.attractionsTitle}>Top 3 Must-Visit</Text>
            </View>
            <Text style={styles.attractionsSubtitle}>Don't miss these iconic attractions!</Text>

            {trip.itinerary.topAttractions.slice(0, 3).map((attraction, index) => (
              <View key={index} style={styles.attractionItem}>
                <View style={[styles.attractionNumber, { backgroundColor: [colors.blue, colors.green, colors.accent][index] }]}>
                  <Text style={styles.attractionNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.attractionContent}>
                  <Text style={styles.attractionName}>{attraction.name}</Text>
                  <Text style={styles.attractionDay}>📍 Included in {attraction.day}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {trip.itinerary.personalizedMessage && (
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>Have an Amazing Trip, {trip.name}!</Text>
            <Text style={styles.messageText}>{trip.itinerary.personalizedMessage}</Text>
            <Text style={styles.messageEmoji}>🎉✨</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>✅ Trip Saved!</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function getActivityEmoji(activity: string): string {
  const lowerActivity = activity.toLowerCase();
  if (lowerActivity.includes('plane') || lowerActivity.includes('airport') || lowerActivity.includes('fly') || lowerActivity.includes('flight')) return '✈️';
  if (lowerActivity.includes('food') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner') || lowerActivity.includes('breakfast') || lowerActivity.includes('eat')) return '🍴';
  if (lowerActivity.includes('hotel') || lowerActivity.includes('check in') || lowerActivity.includes('resort')) return '🏨';
  if (lowerActivity.includes('beach') || lowerActivity.includes('water')) return '🏖️';
  if (lowerActivity.includes('museum') || lowerActivity.includes('gallery')) return '🏛️';
  if (lowerActivity.includes('sunset') || lowerActivity.includes('cocktail')) return '🍹';
  if (lowerActivity.includes('relax')) return '🧘';
  if (lowerActivity.includes('explore') || lowerActivity.includes('walk')) return '🚶';
  return '📍';
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
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.success,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  tapHint: {
    fontSize: 11,
    color: colors.textLight,
  },
  dayToggle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
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
    marginBottom: 14,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 16,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.borderYellow,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.borderOrange,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  directionsText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  attractionsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.borderOrange,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: 40,
    height: 40,
    borderRadius: 8,
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
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.borderOrange,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  messageEmoji: {
    fontSize: 24,
  },
  saveButton: {
    backgroundColor: colors.accentYellow,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '800',
  },
});
