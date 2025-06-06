import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from 'native-base';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { socket } from './socket';
import { registerForPushNotificationsAsync, setupNotificationListener } from './service/notification';

import { persistor, store } from './State/store';
import Main from './Main';
import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const config = createTamagui(defaultConfig)

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};

const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        socket.emit('register_push_token', { token });
      }
    });

    setupNotificationListener();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={config} defaultTheme="light">
          <NativeBaseProvider theme={theme}>
            <NavigationContainer>
              <Main />
            </NavigationContainer>
            <StatusBar style="auto" />
          </NativeBaseProvider>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
