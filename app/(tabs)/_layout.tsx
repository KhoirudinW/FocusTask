import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
// import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar hidden={true}/>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['dark'].tint, // Default to dark theme
          tabBarInactiveTintColor: Colors['dark'].text, // Use text color for inactive tabs
          tabBarStyle: {
            backgroundColor: Colors['dark'].background, // Match dark background
            borderTopWidth: 0, // Remove default border for cleaner look
          },
          headerShown: false,
          // tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="(home)/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(preset)/index"
          options={{
            title: 'Preset',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.fill" color={color} />, // Changed to calendar icon for Preset
          }}
        />
        <Tabs.Screen
          name="(analisis)/index"
          options={{
            title: 'Analisis',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(review)/index"
          options={{
            title: 'Review',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />, // Adjust icon as needed
          }}
        />
        <Tabs.Screen
          name="(profile)/index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol name="person.fill" size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}