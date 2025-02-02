import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AnnouncementPage from "../Screens/Announcement/AnnouncementPage";
import UserProfile from '../Screens/User/Profile';
import AnnouncementDetail from '../Screens/Announcement/AnnouncementDetail';
import FormsNavigator from './FormsNavigator';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AnnouncementPage'
        component={AnnouncementPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetail}
        options={{
          headerShown: false,
        }}
      />
      
    </Stack.Navigator>
  )
}

export default function Home() {
  return (
    <View style={styles.container}>
      <MyStack />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 0,
    padding: 0,
  },
});