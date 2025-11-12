import { View, Text, StyleSheet } from 'react-native';
import { colors } from './colors';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                index + 1 <= currentStep && styles.stepActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index + 1 <= currentStep && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index + 1 < currentStep && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.labelsContainer}>
        {steps.map((step, index) => (
          <Text
            key={index}
            style={[
              styles.stepLabel,
              index + 1 === currentStep && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: colors.success,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    flex: 1,
  },
  stepLabelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
