import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import WeddingForm from "../Screens/User/Wedding/WeddingForm";
// import WeddingForm2 from '../Screens/User/Wedding/WeddingForm2';
// import WeddingForm3 from "../Screens/User/Wedding/WeddingForm3";
// import WeddingFormContainer from "../Screens/User/Wedding/WeddingFormContainer";
import WeddingForm from "../Screens/Forms/Wedding/WeddingForm";
import WeddingForm2 from "../Screens/Forms/Wedding/WeddingForm2";
import WeddingForm3 from "../Screens/Forms/Wedding/WeddingForm3";
import WeddingForm4 from "../Screens/Forms/Wedding/WeddingForm4";
import WeddingForm5 from "../Screens/Forms/Wedding/WeddingForm5";
import WeddingForm6 from "../Screens/Forms/Wedding/WeddingForm6";

import WeddingFormContainer from "../Screens/Forms/Wedding/WeddingFormContainer";

import SubmittedForms from "../Screens/User/SubmittedForms";

// import SubmittedWedding from "../Screens/User/Wedding/SubmittedWedding";
// import SubmittedFuneral from "../Screens/User/Funeral/SubmittedFuneral";
// import SubmittedBaptism from "../Screens/User/Baptism/SubmittedBaptism";

import BinyagForm from "../Screens/Forms/Baptism/BinyagForm";
import FuneralForm from "../Screens/Forms/Funeral/FuneralForm";
import CounselingForm from "../Screens/Forms/Counseling/CounselingForm";
import HouseBlessingForm from "../Screens/Forms/PrivateScheduling/HouseBlessingForm";
import PrayerRequestForm from "../Screens/Forms/Prayers/PrayerRequestForm";

import UserForms from "../Screens/User/UserForms";

//Mass
import BaptismMassForm from "../Screens/Forms/Mass/BinyagMassForm";

const Stack = createStackNavigator();

const FormsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserForms"
        component={UserForms}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeddingFormContainer"
        component={WeddingFormContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm"
        component={WeddingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm2"
        component={WeddingForm2}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm3"
        component={WeddingForm3}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeddingForm4"
        component={WeddingForm4}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm5"
        component={WeddingForm5}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm6"
        component={WeddingForm6}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedForms"
        component={SubmittedForms}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="SubmittedWedding"
        component={SubmittedWedding}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedFuneral"
        component={SubmittedFuneral}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedBaptism"
        component={SubmittedBaptism}
        options={{
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="BinyagForm"
        component={BinyagForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CounselingForm"
        component={CounselingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="HouseBlessingForm"
        component={HouseBlessingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PrayerRequestForm"
        component={PrayerRequestForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="FuneralForm"
        component={FuneralForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BaptismMassForm"
        component={BaptismMassForm}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default FormsNavigator;
