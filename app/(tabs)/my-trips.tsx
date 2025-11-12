import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Animated } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/components/colors';
import { Search, MapPin, Calendar, Star, CircleCheck as CheckCircle, Clock, ShoppingBag, Luggage, Trash2, Eye } from 'lucide-react-native';
import PackingListModal from '@/components/PackingListModal';
import ConfirmModal from '@/components/ConfirmModal';

interface Trip {
  id: string;
  destination: string;
  staying_period: number;
  created_at: string;
  title?: string;
  status: string;
  is_favorite: boolean;
  is_saved: boolean;
  travel_month?: string;
  travel_year?: number;
  has_packing_list?: boolean;
}

type FilterType = 'all' | 'newest' | 'oldest' | 'favorites' | 'completed' | 'upcoming';

const FILTERS: { key: FilterType; label: string; icon: any }[] = [
  { key: 'all', label: 'All', icon: Luggage },
  { key: 'newest', label: 'Newest', icon: Calendar },
  { key: 'oldest', label: 'Oldest', icon: Calendar },
  { key: 'favorites', label: 'Favorites', icon: Star },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
  { key: 'upcoming', label: 'Upcoming', icon: Clock },
];

export default function MyTrips() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [packingListTrip, setPackingListTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [packingLists, setPackingLists] = useState<Record<string, boolean>>({});

  const headerScale = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<{[key: string]: Animated.Value}>({}).current;

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTrips();

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
        ]).start();
      }
    }, [user])
  );

  useEffect(() => {
    filterTrips();
  }, [trips, searchQuery, selectedFilter]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_saved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);

      if (data && data.length > 0) {
        await loadPackingLists(data.map(t => t.id));
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPackingLists = async (tripIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('packing_lists')
        .select('trip_id, items')
        .in('trip_id', tripIds);

      if (error) throw error;

      const packingListMap: Record<string, boolean> = {};
      data?.forEach(pl => {
        const hasCheckedItems = pl.items && Array.isArray(pl.items) &&
          pl.items.some((item: any) => item.checked === true);
        packingListMap[pl.trip_id] = hasCheckedItems;
      });
      setPackingLists(packingListMap);
    } catch (error) {
      console.error('Error loading packing lists:', error);
    }
  };

  const filterTrips = () => {
    let filtered = [...trips];

    if (searchQuery) {
      filtered = filtered.filter(trip =>
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (selectedFilter) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'favorites':
        filtered = filtered.filter(trip => trip.is_favorite);
        break;
      case 'completed':
        filtered = filtered.filter(trip => trip.status === 'completed');
        break;
      case 'upcoming':
        filtered = filtered.filter(trip => trip.status === 'upcoming');
        break;
    }

    setFilteredTrips(filtered);
  };

  const toggleFavorite = async (tripId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ is_favorite: !currentStatus })
        .eq('id', tripId);

      if (error) throw error;

      setTrips(trips.map(trip =>
        trip.id === tripId ? { ...trip, is_favorite: !currentStatus } : trip
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleStatus = async (tripId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'upcoming' ? 'completed' : 'upcoming';
      const { error } = await supabase
        .from('trips')
        .update({ status: newStatus })
        .eq('id', tripId);

      if (error) throw error;

      setTrips(trips.map(trip =>
        trip.id === tripId ? { ...trip, status: newStatus } : trip
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteTrip = async () => {
    if (!tripToDelete) return;

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripToDelete.id);

      if (error) throw error;

      setTrips(trips.filter(trip => trip.id !== tripToDelete.id));
      setTripToDelete(null);

      await loadTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handlePackingListClose = async () => {
    const closedTripId = packingListTrip?.id;
    setPackingListTrip(null);

    if (closedTripId) {
      try {
        const { data, error } = await supabase
          .from('packing_lists')
          .select('items')
          .eq('trip_id', closedTripId)
          .maybeSingle();

        if (error) throw error;

        const hasCheckedItems = data?.items && Array.isArray(data.items) &&
          data.items.some((item: any) => item.checked === true);

        setPackingLists(prev => ({
          ...prev,
          [closedTripId]: hasCheckedItems,
        }));
      } catch (error) {
        console.error('Error updating packing list status:', error);
      }
    }
  };

  const formatDate = (trip: Trip) => {
    if (trip.travel_month && trip.travel_year) {
      return `${trip.travel_month} ${trip.travel_year}`;
    }
    return new Date(trip.created_at).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const getCardAnimation = (id: string) => {
    if (!cardAnimations[id]) {
      cardAnimations[id] = new Animated.Value(1);
    }
    return cardAnimations[id];
  };

  const handleCardPressIn = (id: string) => {
    const anim = getCardAnimation(id);
    Animated.spring(anim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = (id: string) => {
    const anim = getCardAnimation(id);
    Animated.spring(anim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <Animated.View
      style={[
        styles.tripCard,
        {
          transform: [{ scale: getCardAnimation(item.id) }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id, item.is_favorite)}
      >
        <Star
          size={20}
          color={item.is_favorite ? colors.accentYellow : colors.textLight}
          fill={item.is_favorite ? colors.accentYellow : 'none'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/trip/${item.id}`)}
        onPressIn={() => handleCardPressIn(item.id)}
        onPressOut={() => handleCardPressOut(item.id)}
        style={styles.tripContent}
        activeOpacity={0.9}
      >
        <Text style={styles.tripTitle}>
          {item.title || `Trip to ${item.destination}`}
        </Text>

        <View style={styles.tripInfo}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.tripInfoText}>
            {item.destination} • {item.staying_period} days
          </Text>
        </View>

        <View style={styles.tripInfo}>
          <Calendar size={14} color={colors.textLight} />
          <Text style={styles.tripInfoText}>{formatDate(item)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.tripActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/trip/${item.id}`)}
        >
          <Text style={styles.actionButtonText}>View Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.status === 'completed' && styles.completedButton,
          ]}
          onPress={() => toggleStatus(item.id, item.status)}
        >
          <Text
            style={[
              styles.actionButtonText,
              item.status === 'completed' && styles.completedButtonText,
            ]}
          >
            {item.status === 'completed' ? 'Completed' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[
            styles.packingButton,
            packingLists[item.id] && styles.viewPackingButton,
          ]}
          onPress={() => setPackingListTrip(item)}
        >
          {packingLists[item.id] ? (
            <Eye size={16} color={colors.success} />
          ) : (
            <ShoppingBag size={16} color={colors.accent} />
          )}
          <Text
            style={[
              styles.packingButtonText,
              packingLists[item.id] && styles.viewPackingButtonText,
            ]}
          >
            {packingLists[item.id] ? 'View Packing List' : 'Add Packing List'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setTripToDelete(item)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

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
        <View style={styles.headerTop}>
          <Text style={styles.title}>My Trips ✈️</Text>
          <Luggage size={32} color={colors.white} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Luggage size={16} color={colors.textDark} />
          <Text style={styles.filterButtonText}>
            {FILTERS.find(f => f.key === selectedFilter)?.label || 'All'}
          </Text>
          <Text style={styles.filterArrow}>{showFilterDropdown ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showFilterDropdown && (
          <View style={styles.filterDropdown}>
            {FILTERS.map(filter => {
              const Icon = filter.icon;
              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterOption,
                    selectedFilter === filter.key && styles.filterOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter.key);
                    setShowFilterDropdown(false);
                  }}
                >
                  <Icon
                    size={18}
                    color={
                      selectedFilter === filter.key ? colors.white : colors.textDark
                    }
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === filter.key && styles.filterOptionTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Animated.View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : filteredTrips.length === 0 ? (
        <View style={styles.centerContent}>
          <Luggage size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>
            {searchQuery || selectedFilter !== 'all'
              ? 'No trips found'
              : 'No saved trips yet!'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || selectedFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create and save your first trip to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          renderItem={renderTrip}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {packingListTrip && (
        <PackingListModal
          visible={!!packingListTrip}
          tripId={packingListTrip.id}
          tripTitle={packingListTrip.title || `Trip to ${packingListTrip.destination}`}
          userId={user?.id || ''}
          onClose={handlePackingListClose}
        />
      )}

      <ConfirmModal
        visible={!!tripToDelete}
        title="Delete Trip?"
        message={`Are you sure you want to delete "${tripToDelete?.title || `Trip to ${tripToDelete?.destination}`}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteTrip}
        onCancel={() => setTripToDelete(null)}
        isDangerous
      />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 14,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  filterArrow: {
    fontSize: 12,
    color: colors.textLight,
  },
  filterDropdown: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textDark,
  },
  filterOptionTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 10,
    zIndex: 10,
    backgroundColor: colors.cream,
    borderRadius: 12,
  },
  tripContent: {
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
    paddingRight: 32,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  tripInfoText: {
    fontSize: 13,
    color: colors.textLight,
  },
  tripActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  completedButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  completedButtonText: {
    color: colors.white,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 8,
  },
  packingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  viewPackingButton: {
    backgroundColor: colors.greenLight,
    borderColor: colors.success,
    shadowColor: colors.success,
  },
  packingButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  viewPackingButtonText: {
    color: colors.success,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.error,
  },
});
