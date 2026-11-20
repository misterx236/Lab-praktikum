import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider, useApp } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';

function ThemedStack() {
  const { theme } = useApp();
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
          },
          headerTintColor: theme === 'dark' ? '#ffffff' : '#000000',
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#121212' : '#f0f2f5',
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemedStack />
    </AppProvider>
  );
}