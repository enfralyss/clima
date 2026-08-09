import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import FadeIn from './src/components/FadeIn';
import { useWeather } from './src/hooks/useWeather';
import SearchScreen from './src/screens/SearchScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ErrorScreen from './src/screens/ErrorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { Unit } from './src/types';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const { status, weather, forecast, error, history, search, retry, reset, clearHistory } =
    useWeather();
  const [showHistory, setShowHistory] = useState(false);
  const [unit, setUnit] = useState<Unit>('C');
  const [lastQuery, setLastQuery] = useState('');

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#1a1f3d' }} />;
  }

  const startSearch = (query: string) => {
    setShowHistory(false);
    setLastQuery(query.split(',')[0]);
    search(query);
  };

  const goToSearch = () => {
    setShowHistory(false);
    reset();
  };

  let screen;
  if (showHistory) {
    screen = (
      <HistoryScreen
        history={history}
        onSelect={startSearch}
        onClear={clearHistory}
        onNewSearch={goToSearch}
      />
    );
  } else if (status === 'loading') {
    screen = <LoadingScreen query={lastQuery} />;
  } else if (status === 'success' && weather) {
    screen = (
      <ResultScreen
        weather={weather}
        forecast={forecast}
        unit={unit}
        onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
        onBack={goToSearch}
        onNewSearch={goToSearch}
      />
    );
  } else if (status === 'error' && error) {
    screen = (
      <ErrorScreen error={error} onRetry={retry} onEdit={goToSearch} onSuggestion={startSearch} />
    );
  } else {
    screen = (
      <SearchScreen
        onSearch={startSearch}
        onOpenHistory={() => setShowHistory(true)}
        hasHistory={history.length > 0}
        initialQuery={lastQuery}
      />
    );
  }

  const screenKey = showHistory ? 'historial' : status;

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1f3d' }}>
      <StatusBar style="light" />
      <FadeIn key={screenKey} offset={0} style={{ flex: 1 }}>
        {screen}
      </FadeIn>
    </View>
  );
}
