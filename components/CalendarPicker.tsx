import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors } from './colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarPickerProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  minimumDate?: Date;
}

export default function CalendarPicker({ selectedDate, onSelectDate, minimumDate }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isDateDisabled = (day: number | null) => {
    if (!day || !minimumDate) return false;
    const date = new Date(year, month, day);
    return date < minimumDate;
  };

  const isDateSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                selected && styles.selectedDay,
                disabled && styles.disabledDay,
              ]}
              onPress={() => {
                if (day && !disabled) {
                  onSelectDate(new Date(year, month, day));
                }
              }}
              disabled={!day || disabled}
            >
              {day && (
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.selectedDayText,
                    disabled && styles.disabledDayText,
                  ]}
                >
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMedium,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: colors.accent,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: '700',
  },
  disabledDayText: {
    color: colors.textLight,
  },
});
