import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WeddingForm from "../Screens/Forms/Wedding/WeddingForm";
import WeddingForm2 from "../Screens/Forms/Wedding/WeddingForm2";
import WeddingForm3 from "../Screens/Forms/Wedding/WeddingForm3";
import WeddingForm4 from "../Screens/Forms/Wedding/WeddingForm3";
import WeddingForm5 from "../Screens/Forms/Wedding/WeddingForm3";
import WeddingForm6 from "../Screens/Forms/Wedding/WeddingForm3";
import WeddingFormContainer from "../Screens/Forms/Wedding/WeddingFormContainer";
//import WeddingForm5 from "../Screens/User/Wedding/WeddingForm5";

import ConfirmedWedding from "../Screens/Admin/Wedding/ConfirmedWedding";
import AdminAvailableDates from "../Screens/Admin/Wedding/AdminAvailableDates";

const Stack = createStackNavigator();

const WeddingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="WeddingForm"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="WeddingForm"
        component={WeddingForm}
        options={{ title: "Wedding Form" }}
      />
      <Stack.Screen
        name="WeddingForm2"
        component={WeddingForm2}
        options={{ title: "Wedding Form 2" }}
      />
      <Stack.Screen
        name="WeddingForm3"
        component={WeddingForm3}
        options={{ title: "Wedding Form 3" }}
      />

      <Stack.Screen
        name="WeddingForm4"
        component={WeddingForm4}
        options={{ title: "Wedding Form 4" }}
      />

      <Stack.Screen
        name="WeddingForm5"
        component={WeddingForm5}
        options={{ title: "Wedding Form 5" }}
      />

      <Stack.Screen
        name="WeddingForm6"
        component={WeddingForm6}
        options={{ title: "Wedding Form 6" }}
      />
      <Stack.Screen
        name="WeddingFormContainer"
        component={WeddingFormContainer}
        options={{ title: "Wedding Form Container" }}
      />

      <Stack.Screen
        name="ConfirmedWedding"
        component={ConfirmedWedding}
        options={{ title: "Confirmed Wedding" }}
      />

      <Stack.Screen
        name="AdminAvailableDates"
        component={AdminAvailableDates}
        options={{ title: "Admin Available Dates" }}
      />
    </Stack.Navigator>
  );
};

export default WeddingNavigator;
