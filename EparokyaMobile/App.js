import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import Home from './Navigators/Home';
import Header from './Shared/Header';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme, } from "native-base";
// import ProductContainer from './Screens/Product/ProductContainer';
// import DrawerNavigation from './Navigators/DrawerNavigator';
import Auth from './Context/Store/Auth';
import DrawerNavigator from './Navigators/DrawerNavigator';

import { Provider } from "react-redux";
// import store from "./Redux/store";
import SyncStorage from 'sync-storage'
import Main from './Main';

import { persistor, store } from "./State/store";
import { setTheme } from "./State/preferenceSlice";
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';



const theme = extendTheme({ colors: newColorTheme });
const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};



export default function App() {
  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <Header /> */}
        {/* <DrawerNavigator /> */}
        <NativeBaseProvider theme={theme}>
          <Main />
        </NativeBaseProvider>
        {/* <Main /> */}
        {/* <Toast /> */}
      </PersistGate>
    </Provider>


    // <Provider store={store}>
    //   <PersistGate loading={null} persistor={persistor}>
    //     <NativeBaseProvider theme={theme}>
    //       <ApplicationProvider {...eva} theme={eva.light}>
    //         {/* <Header /> */}
    //         {/* <DrawerNavigator /> */}
    //         <Main />
    //         {/* <Toast /> */}
    //       </ApplicationProvider>
    //     </NativeBaseProvider>
    //   </PersistGate>
    // </Provider>

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