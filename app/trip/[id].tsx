import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { colors } from '@/components/colors';
import { ArrowLeft, Clock, MapPin, Footprints, Navigation, Star, ChevronDown, ChevronRight, Bookmark, BookmarkCheck, Sparkles, Ticket } from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';
import Notification from '@/components/Notification';
import SaveTripModal from '@/components/SaveTripModal';
import ConfirmModal from '@/components/ConfirmModal';

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
  title?: string;
  is_saved: boolean;
  itinerary: {
    days: DayItinerary[];
    topAttractions: Array<{ name: string; day: string }>;
    personalizedMessage: string;
  };
}

export default function TripDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadTrip();
  }, [id]);

  useEffect(() => {
    if (!loading && trip) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, trip]);

  const loadTrip = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setTrip(data);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async (customName?: string) => {
    if (!trip || !user) return;

    setSaving(true);
    try {
      const tripTitle = customName || `Trip to ${trip.destination}`;

      const { error } = await supabase
        .from('trips')
        .update({
          is_saved: true,
          title: tripTitle,
        })
        .eq('id', trip.id);

      if (error) throw error;

      setTrip({ ...trip, is_saved: true, title: tripTitle });
      setShowSaveModal(false);
      setShowNotification(true);
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBackPress = () => {
    if (trip && !trip.is_saved) {
      setShowUnsavedWarning(true);
    } else {
      router.back();
    }
  };

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedWarning(false);
    router.back();
  };

  const toggleDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter(d => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  const getDirections = (dayData: DayItinerary) => {
    const waypoints = dayData.activities
      .filter(activity => !activity.toLowerCase().includes('hotel') &&
                         !activity.toLowerCase().includes('check in') &&
                         !activity.toLowerCase().includes('rest'))
      .map(activity => {
        const match = activity.match(/at\s+([^-]+)/i) || activity.match(/visit\s+([^-]+)/i) || activity.match(/explore\s+([^-]+)/i);
        return match ? match[1].trim() : activity.split('-')[0].trim();
      });

    if (waypoints.length === 0) return;

    const destination = `${trip?.destination}`;
    const waypointsParam = waypoints.slice(0, -1).map(w => `${w}, ${destination}`).join('|');
    const finalDestination = waypoints[waypoints.length - 1] + ', ' + destination;

    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(finalDestination)}&travelmode=walking`;

    if (waypointsParam) {
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }

    Linking.openURL(url);
  };

  const bookTicket = (attractionName: string) => {
    const searchQuery = `${attractionName} ${trip?.destination}`;
    const url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(searchQuery)}`;
    Linking.openURL(url);
  };

  const getBookableAttractions = (dayActivities: string[]) => {
    const bookableKeywords = ['museum', 'tower', 'palace', 'cathedral', 'attraction', 'tour', 'gallery', 'monument', 'castle', 'temple', 'church', 'park'];
    return dayActivities
      .filter(activity => {
        const lower = activity.toLowerCase();
        return bookableKeywords.some(keyword => lower.includes(keyword));
      })
      .map(activity => {
        const match = activity.match(/at\s+([^-]+)/i) || activity.match(/visit\s+([^-]+)/i) || activity.match(/explore\s+([^-]+)/i);
        return match ? match[1].trim() : activity.split('-')[0].trim();
      })
      .slice(0, 2);
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
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.success]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{trip.destination}</Text>
          <View style={styles.headerBadge}>
            <Sparkles size={14} color={colors.accentYellow} />
            <Text style={styles.headerBadgeText}>{trip.staying_period} Days</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
        {trip.itinerary.days.map((day, dayIndex) => (
          <View key={day.day} style={styles.dayCard}>
            <TouchableOpacity
              style={styles.dayHeader}
              onPress={() => toggleDay(day.day)}
              activeOpacity={0.7}
            >
              <View style={styles.dayHeaderLeft}>
                <Text style={styles.dayTitle}>Day {day.day}</Text>
                <Text style={styles.daySubtitlePreview}>{day.title}</Text>
              </View>
              {expandedDays.includes(day.day) ? (
                <ChevronDown size={24} color={colors.primary} />
              ) : (
                <ChevronRight size={24} color={colors.textLight} />
              )}
            </TouchableOpacity>

            {expandedDays.includes(day.day) && (
              <View style={styles.dayContent}>
                {day.activities.map((activity, index) => (
                  <View key={index} style={styles.activity}>
                    <View style={styles.activityIcon}>
                      <Text style={styles.activityEmoji}>{getActivityEmoji(activity)}</Text>
                    </View>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}

                {(day.duration || day.distance || day.steps) && (
                  <View style={styles.statsContainer}>
                    <View style={styles.statsTopRow}>
                      {day.duration && (
                        <View style={styles.statBadge}>
                          <Clock size={16} color={colors.text} />
                          <Text style={styles.statBadgeText}>{day.duration}</Text>
                        </View>
                      )}
                      {day.distance && (
                        <View style={styles.statBadge}>
                          <MapPin size={16} color={colors.text} />
                          <Text style={styles.statBadgeText}>{day.distance}</Text>
                        </View>
                      )}
                    </View>
                    {day.steps && (
                      <View style={styles.stepsRow}>
                        <View style={styles.statBadge}>
                          <Footprints size={16} color={colors.text} />
                          <Text style={styles.statBadgeText}>{day.steps}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => getDirections(day)}
                >
                  <Navigation size={18} color={colors.white} />
                  <Text style={styles.directionsText}>🗺️ Get Directions for Day {day.day}</Text>
                </TouchableOpacity>

                {getBookableAttractions(day.activities).map((attraction, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.bookingButton}
                    onPress={() => bookTicket(attraction)}
                  >
                    <Ticket size={18} color={colors.white} />
                    <Text style={styles.bookingText}>🎫 Book Ticket: {attraction}</Text>
                  </TouchableOpacity>
                ))}
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

        {trip.is_saved ? (
          <TouchableOpacity style={styles.savedButton} disabled>
            <BookmarkCheck size={20} color={colors.textDark} />
            <Text style={styles.savedButtonText}>Trip Saved</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowSaveModal(true)}
            disabled={saving}
          >
            <Bookmark size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Trip'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      <SaveTripModal
        visible={showSaveModal}
        defaultName={`Trip to ${trip.destination}`}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveTrip}
      />

      <Notification
        visible={showNotification}
        message='Trip saved in "My Trips"'
        onHide={() => setShowNotification(false)}
      />

      <ConfirmModal
        visible={showUnsavedWarning}
        title="Leave Without Saving?"
        message="Your trip hasn't been saved yet. If you leave now, you'll lose this itinerary."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={handleLeaveWithoutSaving}
        onCancel={() => setShowUnsavedWarning(false)}
        isDangerous
      />
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
    paddingBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 10,
    borderRadius: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  headerBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  animatedContainer: {
    flex: 1,
  },
  dayCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: colors.cream,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  daySubtitlePreview: {
    fontSize: 14,
    color: colors.textMedium,
    fontWeight: '600',
  },
  dayContent: {
    padding: 20,
    backgroundColor: colors.surfaceLight,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  statsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  statsTopRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.borderYellow,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.borderOrange,
    flex: 1,
    justifyContent: 'center',
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  directionsText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  bookingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  attractionsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: colors.accentLight,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
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
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  attractionsSubtitle: {
    fontSize: 13,
    color: colors.textMedium,
    marginBottom: 20,
    fontWeight: '500',
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  attractionNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  attractionNumberText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  attractionContent: {
    flex: 1,
  },
  attractionName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  attractionDay: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: colors.peach,
    borderRadius: 24,
    padding: 28,
    marginBottom: 18,
    borderWidth: 0,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  messageEmoji: {
    fontSize: 32,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  savedButton: {
    backgroundColor: colors.successLight,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  savedButtonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },
});
