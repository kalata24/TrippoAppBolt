import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/components/colors';
import { ChevronDown } from 'lucide-react-native';

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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2025', '2026', '2027'];

export default function Destination() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [stayingPeriod, setStayingPeriod] = useState('');
  const [month, setMonth] = useState('');
  const [showMonths, setShowMonths] = useState(false);
  const [year, setYear] = useState('');
  const [showYears, setShowYears] = useState(false);

  const handleContinue = () => {
    if (!destination || !stayingPeriod || !month || !year) return;

    const period = parseInt(stayingPeriod);
    if (period < 1 || period > 30) return;

    router.push({
      pathname: '/(onboarding)/food',
      params: { destination, stayingPeriod, month, year },
    });
  };

  const isValid = destination && stayingPeriod && parseInt(stayingPeriod) >= 1 && parseInt(stayingPeriod) <= 30 && month && year;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 1 of 5</Text>
        <Text style={styles.title}>Pick a destination{'\n'}and travel details</Text>

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

        <View style={styles.field}>
          <Text style={styles.label}>Staying Period (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of days"
            value={stayingPeriod}
            onChangeText={setStayingPeriod}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Maximum 30 days</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Month</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowMonths(!showMonths)}
            >
              <Text style={[styles.dropdownText, !month && styles.placeholder]}>
                {month || 'Month'}
              </Text>
              <ChevronDown size={20} color={colors.textLight} />
            </TouchableOpacity>

            {showMonths && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {MONTHS.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setMonth(m);
                        setShowMonths(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Year</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowYears(!showYears)}
            >
              <Text style={[styles.dropdownText, !year && styles.placeholder]}>
                {year || 'Year'}
              </Text>
              <ChevronDown size={20} color={colors.textLight} />
            </TouchableOpacity>

            {showYears && (
              <View style={styles.dropdownMenu}>
                {YEARS.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setYear(y);
                      setShowYears(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  step: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 8,
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
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
