import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/components/colors';
import { ChevronDown } from 'lucide-react-native';
import StepProgress from '@/components/StepProgress';

const TOP_DESTINATIONS = [
  'Paris, France',
  'Tokyo, Japan',
  'New York, USA',
  'London, UK',
  'Dubai, UAE',
  'Rome, Italy',
  'Barcelona, Spain',
  'Istanbul, Turkey',
  'Bali, Indonesia',
  'Bangkok, Thailand',
  'Sydney, Australia',
  'Amsterdam, Netherlands',
  'Singapore',
  'Athens, Greece',
  'Prague, Czech Republic',
  'Venice, Italy',
  'Santorini, Greece',
  'Cancun, Mexico',
  'Maldives',
  'Lisbon, Portugal',
];


export default function Destination() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const calculateStayingPeriod = () => {
    if (!startDate || !endDate) return 0;
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const stayingPeriod = calculateStayingPeriod();

  const handleContinue = () => {
    if (!destination || !startDate || !endDate) return;

    if (stayingPeriod < 1 || stayingPeriod > 30) return;

    router.push({
      pathname: '/(onboarding)/food',
      params: {
        destination,
        stayingPeriod: stayingPeriod.toString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
    });
  };

  const isValid = destination && startDate && endDate && stayingPeriod >= 1 && stayingPeriod <= 30;

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StepProgress
          currentStep={1}
          totalSteps={5}
          steps={['Destination', 'Food', 'Personality', 'Your Info', 'Your Trip']}
        />
      </View>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Pick a destination{'\n'}and staying period</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Destination</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDestinations(!showDestinations)}
          >
            <Text style={[styles.dropdownText, !destination && styles.placeholder]}>
              {destination || 'Select destination'}
            </Text>
            <ChevronDown size={20} color={colors.textLight} />
          </TouchableOpacity>

          {showDestinations && (
            <View style={styles.dropdownMenu}>
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {TOP_DESTINATIONS.map((dest) => (
                  <TouchableOpacity
                    key={dest}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setDestination(dest);
                      setShowDestinations(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{dest}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={[styles.dropdownText, !startDate && styles.placeholder]}>
                {startDate ? formatDate(startDate) : 'Select start date'}
              </Text>
              <ChevronDown size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={[styles.dropdownText, !endDate && styles.placeholder]}>
                {endDate ? formatDate(endDate) : 'Select end date'}
              </Text>
              <ChevronDown size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setStartDate(selectedDate);
                if (endDate && selectedDate > endDate) {
                  setEndDate(undefined);
                }
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate || startDate || new Date()}
            mode="date"
            display="default"
            minimumDate={startDate || new Date()}
            onChange={(event, selectedDate) => {
              setShowEndPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        {startDate && endDate && (
          <View style={styles.periodInfo}>
            <Text style={styles.periodText}>
              {stayingPeriod} {stayingPeriod === 1 ? 'day' : 'days'}
            </Text>
            {stayingPeriod > 30 && (
              <Text style={styles.errorText}>Maximum 30 days allowed</Text>
            )}
          </View>
        )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !isValid && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    margin: 20,
    marginTop: 0,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.textLight,
  },
  dropdownMenu: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
  },
  periodInfo: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.accent + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flex: 2,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
