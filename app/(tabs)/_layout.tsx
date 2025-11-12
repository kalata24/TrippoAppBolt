import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Plane, BarChart3, Map, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/components/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 3,
          borderTopColor: colors.cream,
          paddingBottom: 20,
          paddingTop: 16,
          height: 95,
          elevation: 12,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
          paddingBottom: 2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarItemStyle: {
          paddingVertical: 6,
          gap: 4,
        },
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Organize',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.cream : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Plane
                size={26}
                color={focused ? colors.accent : color}
                fill={focused ? colors.accent : 'transparent'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.cream : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}
            >
              <BarChart3
                size={26}
                color={focused ? colors.success : color}
                fill={focused ? colors.success : 'transparent'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="my-trips"
        options={{
          title: 'My trips',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.cream : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Map
                size={26}
                color={focused ? colors.primary : color}
                fill={focused ? colors.primary : 'transparent'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Log out',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.errorLight : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}
            >
              <LogOut size={26} color={focused ? colors.error : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
