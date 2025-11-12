import { Tabs } from 'expo-router';
import { Plane, BarChart3, Map, LogOut } from 'lucide-react-native';
import { colors } from '@/components/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textLight,
        tabBarItemStyle: {
          paddingVertical: 6,
          gap: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Organize',
          tabBarIcon: ({ color, focused }) => (
            <Plane
              size={24}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <BarChart3
              size={24}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-trips"
        options={{
          title: 'My trips',
          tabBarIcon: ({ color, focused }) => (
            <Map
              size={24}
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Log out',
          tabBarIcon: ({ color }) => <LogOut size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
