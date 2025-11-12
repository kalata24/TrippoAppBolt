import { View, Text, StyleSheet, Animated, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Plane, Calendar, CheckCircle, MapPin, Clock, Award } from 'lucide-react-native';
import { colors } from '@/components/colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFocusEffect } from '@react-navigation/native';

interface TripStats {
  totalPlanned: number;
  totalDaysTraveled: number;
  tripsCompleted: number;
  upcomingTrips: number;
  destinationsVisited: number;
  longestTrip: number;
  avgTripLength: number;
  travelScore: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TripStats>({
    totalPlanned: 0,
    totalDaysTraveled: 0,
    tripsCompleted: 0,
    upcomingTrips: 0,
    destinationsVisited: 0,
    longestTrip: 0,
    avgTripLength: 0,
    travelScore: 0,
  });
  const [loading, setLoading] = useState(true);

  const headerScale = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadStats();
      }
    }, [user])
  );

  const loadStats = async () => {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_saved', true);

      if (error) throw error;

      if (trips && trips.length > 0) {
        const completed = trips.filter(t => t.status === 'completed');
        const upcoming = trips.filter(t => t.status !== 'completed');

        const totalDays = trips.reduce((sum, trip) => sum + (trip.staying_period || 0), 0);
        const completedDays = completed.reduce((sum, trip) => sum + (trip.staying_period || 0), 0);
        const longestTrip = Math.max(...trips.map(t => t.staying_period || 0));
        const avgTrip = trips.length > 0 ? Math.round(totalDays / trips.length) : 0;

        const uniqueDestinations = new Set(trips.map(t => t.destination.toLowerCase())).size;

        const score = (completed.length * 100) + (completedDays * 25);

        setStats({
          totalPlanned: trips.length,
          totalDaysTraveled: completedDays,
          tripsCompleted: completed.length,
          upcomingTrips: upcoming.length,
          destinationsVisited: uniqueDestinations,
          longestTrip,
          avgTripLength: avgTrip,
          travelScore: score,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>Dashboard</Text>
            <BarChart3 size={32} color={colors.white} />
          </View>
        </Animated.View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Dashboard</Text>
          <BarChart3 size={32} color={colors.white} />
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: contentFade }]}>
          <View style={[styles.statCard, styles.cardOrange]}>
            <Plane size={32} color={colors.accent} />
            <Text style={styles.statLabel}>Total Trips Planned</Text>
            <Text style={styles.statValue}>{stats.totalPlanned}</Text>
          </View>

          <View style={[styles.statCard, styles.cardBlue]}>
            <Calendar size={32} color={colors.blue} />
            <Text style={styles.statLabel}>Total Days Traveled</Text>
            <Text style={styles.statValue}>{stats.totalDaysTraveled}</Text>
          </View>

          <View style={[styles.statCard, styles.cardGreen]}>
            <CheckCircle size={32} color={colors.success} />
            <Text style={styles.statLabel}>Trips Completed</Text>
            <Text style={styles.statValue}>{stats.tripsCompleted}</Text>
          </View>

          <View style={[styles.statCard, styles.cardMint]}>
            <Calendar size={32} color={colors.primary} />
            <Text style={styles.statLabel}>Upcoming Trips</Text>
            <Text style={styles.statValue}>{stats.upcomingTrips}</Text>
          </View>

          <View style={[styles.achievementsCard, styles.cardPurple]}>
            <View style={styles.achievementsHeader}>
              <Award size={24} color={colors.accent} />
              <Text style={styles.achievementsTitle}>Travel Achievements</Text>
            </View>

            <View style={styles.achievementsGrid}>
              <View style={styles.achievementRow}>
                <View style={styles.achievementItem}>
                  <MapPin size={32} color={colors.blue} />
                  <Text style={styles.achievementLabel}>Destinations Visited</Text>
                  <Text style={styles.achievementValue}>{stats.destinationsVisited}</Text>
                </View>

                <View style={styles.achievementItem}>
                  <Calendar size={32} color={colors.accent} />
                  <Text style={styles.achievementLabel}>Longest Trip</Text>
                  <Text style={styles.achievementValue}>{stats.longestTrip} days</Text>
                </View>
              </View>

              <View style={styles.achievementRow}>
                <View style={styles.achievementItem}>
                  <Clock size={32} color={colors.primary} />
                  <Text style={styles.achievementLabel}>Avg Trip Length</Text>
                  <Text style={styles.achievementValue}>{stats.avgTripLength} days</Text>
                </View>

                <View style={styles.achievementItem}>
                  <Award size={32} color={colors.accentDark} />
                  <Text style={styles.achievementLabel}>Travel Score</Text>
                  <Text style={styles.achievementSubtext}>Complete trips to increase</Text>
                  <Text style={styles.achievementValue}>{stats.travelScore}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    paddingBottom: 24,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  cardOrange: {
    backgroundColor: '#FFF4E6',
    borderColor: colors.accentLight,
  },
  cardBlue: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.blueLight,
  },
  cardGreen: {
    backgroundColor: '#F1F8E9',
    borderColor: colors.greenLight,
  },
  cardMint: {
    backgroundColor: '#E0F2F1',
    borderColor: colors.primaryLight,
  },
  cardPurple: {
    backgroundColor: '#F3E5F5',
    borderColor: '#E1BEE7',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMedium,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textDark,
  },
  achievementsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
    marginTop: 8,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  achievementsGrid: {
    gap: 16,
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementItem: {
    flex: 1,
    gap: 8,
  },
  achievementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMedium,
    marginTop: 4,
  },
  achievementValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textDark,
  },
  achievementSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textLight,
    fontStyle: 'italic',
  },
});
