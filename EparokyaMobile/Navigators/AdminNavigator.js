import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserList from "../Screens/Admin/User/UserList";
import UpdateUser from "../Screens/Admin/User/UpdateUser";

import AdminWedding from "../Screens/Admin/Wedding/AdminWedding";
import WeddingDetails from "../Screens/Admin/Wedding/WeddingDetails";
import ConfirmedWedding from "../Screens/Admin/Wedding/ConfirmedWedding";
import AdminAvailableDates from "../Screens/Admin/Wedding/AdminAvailableDates";

import FuneralList from "../Screens/Admin/Funeral/FuneralList";
import FuneralDetails from "../Screens/Admin/Funeral/FuneralDetails";
import ConfirmedFuneral from "../Screens/Admin/Funeral/ConfirmedFuneral";
import ConfirmedFuneralDetails from "../Screens/Admin/Funeral/ConfirmedFuneralDetails";

import ministryCategory from "../Screens/Admin/Ministries/CreateMinistry";
import ministryList from "../Screens/Admin/Ministries/MinistryList";

import announcementCategory from "../Screens/Admin/Announcement/AnnouncementCategory";
import announcementCategoryList from "../Screens/Admin/Announcement/AnnouncementCategoryList";
import announcement from "../Screens/Admin/Announcement/Announcement";

import Dashboard from "../Screens/Admin/Dashboard";
import Cards from "../Screens/Admin/Cards";
import Forms from "../Screens/Admin/Forms";

import resourceCategory from "../Screens/Admin/Resource/resourceCategory";
import CreatePostResource from "../Screens/Admin/Resource/CreatePostResource";

import CreateMemberYear from "../Screens/Admin/Members/CreateMemberYear";
import Members from "../Screens/Admin/Members/Members";
import MemberList from "../Screens/Admin/Members/MemberList";
import MemberDetail from "../Screens/Admin/Members/MemberDetail";

import BaptismList from "../Screens/Admin/Baptism/BaptismList";
import BaptismDetails from "../Screens/Admin/Baptism/BaptismDetail";

import Chat from "../Screens/Admin/Chats/Chat";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Cards"
        component={Cards}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Forms"
        component={Forms}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AdminWedding"
        component={AdminWedding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WeddingDetails"
        component={WeddingDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmedWedding"
        component={ConfirmedWedding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminAvailableDates"
        component={AdminAvailableDates}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FuneralList"
        component={FuneralList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FuneralDetails"
        component={FuneralDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmedFuneral"
        component={ConfirmedFuneral}
        options={{ headerShown: false }}
      />

       <Stack.Screen
        name="ConfirmedFuneralDetails"
        component={ConfirmedFuneralDetails}
        options={{ headerShown: false }}
      />



      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateUser"
        component={UpdateUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ministryCategory"
        component={ministryCategory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ministryList"
        component={ministryList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CreateMemberYear"
        component={CreateMemberYear}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Members"
        component={Members}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="MemberList"
        component={MemberList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="MemberDetail"
        component={MemberDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcementCategory"
        component={announcementCategory}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcementCategoryList"
        component={announcementCategoryList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcement"
        component={announcement}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="resourceCategory"
        component={resourceCategory}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CreatePostResource"
        component={CreatePostResource}
        options={{ headerShown: true }}
      />
      
      <Stack.Screen
        name="BaptismList"
        component={BaptismList}
        options={{ headerShown: true }}
      />
      
      <Stack.Screen
        name="BaptismDetails"
        component={BaptismDetails}
        options={{ headerShown: true }}
      />

      {/* Chat */}
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: true }}
      />

    </Stack.Navigator>
  );
};

export default AdminNavigator;
