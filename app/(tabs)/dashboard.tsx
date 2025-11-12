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

          <View style={[styles.statCard, styles.cardOrange]}>
            <MapPin size={32} color={colors.accentDark} />
            <Text style={styles.statLabel}>Destinations Visited</Text>
            <Text style={styles.statValue}>{stats.destinationsVisited}</Text>
          </View>

          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.scoreIcon}>
                <Award size={40} color="#FFD700" />
              </View>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreLabel}>TRAVEL SCORE</Text>
                <Text style={styles.scoreValue}>{stats.travelScore.toLocaleString()}</Text>
                <Text style={styles.scoreLevelText}>Level {Math.floor(stats.travelScore / 500) + 1} Explorer</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${((stats.travelScore % 500) / 500) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stats.travelScore % 500} / 500 to Level {Math.floor(stats.travelScore / 500) + 2}
              </Text>
            </View>

            <View style={styles.scoreBreakdown}>
              <View style={styles.breakdownItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.breakdownText}>{stats.tripsCompleted} trips × 100 pts</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Calendar size={16} color={colors.blue} />
                <Text style={styles.breakdownText}>{stats.totalDaysTraveled} days × 25 pts</Text>
              </View>
            </View>
          </View>

          <View style={styles.achievementsCard}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Achievements</Text>
              <Text style={styles.achievementsSubtitle}>Keep traveling to unlock more!</Text>
            </View>

            <View style={styles.achievementsGrid}>
              <View style={[styles.achievementBadge, stats.destinationsVisited >= 5 ? styles.badgeUnlocked : styles.badgeLocked]}>
                <MapPin size={28} color={stats.destinationsVisited >= 5 ? colors.blue : colors.textLight} />
                <Text style={[styles.badgeTitle, !stats.destinationsVisited >= 5 && styles.badgeTitleLocked]}>
                  World Explorer
                </Text>
                <Text style={styles.badgeProgress}>{stats.destinationsVisited}/5 destinations</Text>
                {stats.destinationsVisited >= 5 && <Text style={styles.badgeUnlockedText}>UNLOCKED</Text>}
              </View>

              <View style={[styles.achievementBadge, stats.longestTrip >= 7 ? styles.badgeUnlocked : styles.badgeLocked]}>
                <Calendar size={28} color={stats.longestTrip >= 7 ? colors.accent : colors.textLight} />
                <Text style={[styles.badgeTitle, !stats.longestTrip >= 7 && styles.badgeTitleLocked]}>
                  Week Warrior
                </Text>
                <Text style={styles.badgeProgress}>{stats.longestTrip}/7 days</Text>
                {stats.longestTrip >= 7 && <Text style={styles.badgeUnlockedText}>UNLOCKED</Text>}
              </View>

              <View style={[styles.achievementBadge, stats.tripsCompleted >= 10 ? styles.badgeUnlocked : styles.badgeLocked]}>
                <Plane size={28} color={stats.tripsCompleted >= 10 ? colors.primary : colors.textLight} />
                <Text style={[styles.badgeTitle, !stats.tripsCompleted >= 10 && styles.badgeTitleLocked]}>
                  Frequent Flyer
                </Text>
                <Text style={styles.badgeProgress}>{stats.tripsCompleted}/10 trips</Text>
                {stats.tripsCompleted >= 10 && <Text style={styles.badgeUnlockedText}>UNLOCKED</Text>}
              </View>

              <View style={[styles.achievementBadge, stats.totalDaysTraveled >= 30 ? styles.badgeUnlocked : styles.badgeLocked]}>
                <Clock size={28} color={stats.totalDaysTraveled >= 30 ? colors.accentDark : colors.textLight} />
                <Text style={[styles.badgeTitle, !stats.totalDaysTraveled >= 30 && styles.badgeTitleLocked]}>
                  Month Nomad
                </Text>
                <Text style={styles.badgeProgress}>{stats.totalDaysTraveled}/30 days</Text>
                {stats.totalDaysTraveled >= 30 && <Text style={styles.badgeUnlockedText}>UNLOCKED</Text>}
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
  cardOrange: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
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
  scoreCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    gap: 20,
    marginTop: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  scoreInfo: {
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreLevelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scoreBreakdown: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  achievementsCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
    marginTop: 8,
  },
  achievementsHeader: {
    gap: 4,
  },
  achievementsTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textDark,
  },
  achievementsSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    width: '48%',
    padding: 16,
    borderRadius: 14,
    gap: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeUnlocked: {
    backgroundColor: '#F0FFF4',
    borderColor: colors.success,
  },
  badgeLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: colors.textLight,
  },
  badgeProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMedium,
    textAlign: 'center',
  },
  badgeUnlockedText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: 1,
    marginTop: 4,
  },
});
