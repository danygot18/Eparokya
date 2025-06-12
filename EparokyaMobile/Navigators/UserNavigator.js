import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import Register2 from "../Screens/User/Register2";
import Register3 from "../Screens/User/Register3";
import Register4 from "../Screens/User/Register4";

import UserProfile from "../Screens/User/Profile";
import UpdateProfile from "../Screens/User/Update";

// import WeddingForm from "../Screens/User/Wedding/WeddingForm";
// import WeddingForm2 from "../Screens/User/Wedding/WeddingForm2";
// import WeddingForm3 from "../Screens/User/Wedding/WeddingForm3";
// import WeddingFormContainer from "../Screens/User/Wedding/WeddingFormContainer";

import SubmittedForms from "../Screens/User/SubmittedForms";

// import SubmittedWedding from "../Screens/Forms/Wedding/SubmittedWedding";
import SubmittedWeddingList from "../Screens/User/Wedding/SubmittedWeddingList";
import SubmittedFuneralList from "../Screens/User/Funeral/SubmittedFuneralList";
import SubmittedBaptismList from "../Screens/User/Baptism/SubmittedBaptismList";
import SubmittedCounselingList from "../Screens/User/Counseling/SubmittedCounselingList";
import SubmittedHouseBlessingList from "../Screens/User/PrivateScheduling/SubmittedHouseBlessingList";
import SubmittedPrayerRequestList from "../Screens/User/Prayers/SubmittedPrayerRequestList";

// import BinyagForm from "../Screens/User/Baptism/BinyagForm";

import SubmittedWeddingForm from "../Screens/User/Wedding/MySubmittedWeddingForm";
import SubmittedFuneralForm from "../Screens/User/Funeral/MySubmittedFuneralForm";
import SubmittedBaptismForm from "../Screens/User/Baptism/MySubmittedBaptismForm";
import SubmittedCounselingForm from "../Screens/User/Counseling/MySubmittedCounselingForm";
import SubmittedHouseBlessingForm from "../Screens/User/PrivateScheduling/MySubmittedHouseBlessingForm";

// import SubmittedPrayerWall from "../Screens/User/Prayers/MySubmittedPrayerWall";
import SubmittedWeddingDetails from "../Screens/User/Wedding/SubmittedWeddingDetails";

import Calendar from "../Screens/Calendar/Calendar";
// import Announcement from "../Screens/User/Announcement/AnnouncementPage";
// import AnnouncementDetail from "../Screens/User/Announcement/AnnouncementDetail";

import UserChat from "../Screens/User/UserChats/UserChat";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register2"
        component={Register2}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register3"
        component={Register3}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register4"
        component={Register4}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
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
      <Stack.Screen
        name="SubmittedWeddingList"
        component={SubmittedWeddingList}
        options={{
          headerShown: false,
        }}
      />

       <Stack.Screen
        name="SubmittedWeddingDetails"
        component={SubmittedWeddingDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedFuneralList"
        component={SubmittedFuneralList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedBaptismList"
        component={SubmittedBaptismList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedCounselingList"
        component={SubmittedCounselingList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedPrayerRequestList"
        component={SubmittedPrayerRequestList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedHouseBlessingList"
        component={SubmittedHouseBlessingList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedWeddingForm"
        component={SubmittedWeddingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedBaptismForm"
        component={SubmittedBaptismForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedCounselingForm"
        component={SubmittedCounselingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedFuneralForm"
        component={SubmittedFuneralForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedHouseBlessingForm"
        component={SubmittedHouseBlessingForm}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
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
        name="SubmittedForms"
        component={SubmittedForms}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SubmittedWedding"
        component={SubmittedWedding}
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
      />

      <Stack.Screen
        name="FuneralForm"
        component={FuneralForm}
        options={{
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="Announcement"
        component={Announcement}
        options={{
          headerShown: false,
        }}
      /> */}

      {/* <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetail}
        options={{
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UserChat"
        component={UserChat}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
