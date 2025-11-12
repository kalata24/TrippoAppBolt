import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Plane, TrendingUp, Map, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/components/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          paddingBottom: 20,
          paddingTop: 16,
          height: 95,
          elevation: 12,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
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
                backgroundColor: focused ? colors.accent + '20' : 'transparent',
                padding: 10,
                borderRadius: 16,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Plane
                size={26}
                color={focused ? colors.accent : color}
                strokeWidth={focused ? 2.5 : 2}
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
                backgroundColor: focused ? colors.blue + '20' : 'transparent',
                padding: 10,
                borderRadius: 16,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <TrendingUp
                size={26}
                color={focused ? colors.blue : color}
                strokeWidth={focused ? 2.5 : 2}
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
                backgroundColor: focused ? colors.success + '20' : 'transparent',
                padding: 10,
                borderRadius: 16,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Map
                size={26}
                color={focused ? colors.success : color}
                strokeWidth={focused ? 2.5 : 2}
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
                backgroundColor: focused ? colors.error + '20' : 'transparent',
                padding: 10,
                borderRadius: 16,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <LogOut
                size={26}
                color={focused ? colors.error : color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
