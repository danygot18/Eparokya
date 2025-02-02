import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Box,
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
  Icon,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../Redux/Actions/userActions";
//import { loginAction } from "../Redux/Actions/userActions"; 
import Login from "../Screens/User/Login";
import Main from "./Main";
import AdminNavigator from "./AdminNavigator";
// import UserNavigator from "./UserNavigator";
import CalendarComponent from "../Screens/Calendar/Calendar";

import Forms from "../Screens/User/UserForms";
// import Announcement from "../Screens/User/Announcement/AnnouncementPage";
import Profile from "../Screens/User/Profile";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Calendar":
      return "calendar";
    case "Forms":
      return "file-document";
    case "Admin Dashboard":
      return "monitor-dashboard";
    case "Profile":
      return "account";
    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="0" my="0" mx="0" bg="#154314">
        <VStack divider={<Divider />} space="0">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                key={index}
                px="5"
                py="3"
                rounded="md"
                bg={index === props.state.index ? "#b3cf99" : "transparent"}
                onPress={() => props.navigation.navigate(name)}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={index === props.state.index ? "white" : "gray.500"}
                    size="5"
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={index === props.state.index ? "white" : "white"}
                    fontFamily="Roboto"
                    fontSize="md"
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}

            <Pressable
              px="5"
              py="3"
              rounded="md"
              bg="transparent"
              onPress={() => props.navigation.navigate("Login")}
            >
              {/* <HStack space="7" alignItems="center">
                <Icon
                  color="white"
                  size="5"
                  as={<MaterialCommunityIcons name="account" />}
                />
                <Text
                  fontWeight="500"
                  color="white"
                  fontFamily="Roboto"
                  fontSize="md"
                >
                  Login
                </Text>
              </HStack> */}
            </Pressable>
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box safeArea flex={1} bg="#154314" paddingTop={StatusBar.currentHeight || 0}>
      <StatusBar backgroundColor="#154314" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <Pressable onPress={() => navigation.toggleDrawer()} p="2">
              <MaterialCommunityIcons name="menu-open" size={30} color="green" />
            </Pressable>),
          // headerLeft: () => (
          //   <Pressable onPress={() => navigation.toggleDrawer()} p="2">
          //     <MaterialCommunityIcons name="menu-open" size={24} color="white" />
          //   </Pressable>
          // ),
          drawerStyle: {
            backgroundColor: "#154314",
            width: "80%",
          },
        })}
      >
        <Drawer.Screen name="HomeTab" component={Main} />
        <Drawer.Screen name="Calendar" component={CalendarComponent} />
        <Drawer.Screen name="Forms" component={Forms} />
        {user?.isAdmin && (
          <Drawer.Screen name="Admin Dashboard" component={AdminNavigator} />
        )}
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    </Box>
  );
};

export default DrawerNavigator;
