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
  Avatar,
  Center,
  Badge,
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
import PrayerWall from "../Screens/Prayers/PrayerWall";
import ResourcePage from "../Screens/Resource/ResourcePage";
import UserLive from "../Screens/User/UserLive";
import { useState } from "react";
import NotificationUser from "../service/notificationUser";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Resource Page":
      return "calendar";
    case "Calendar":
      return "calendar";
    case "Forms":
      return "file-document";
    case "Prayer Wall":
      return "book-open-page-variant";
    case "Admin Dashboard":
      return "monitor-dashboard";
    case "Profile":
      return "account";
    case "Live":
      return "video";

    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="0" my="0" mx="0" bg="#154314">
        <VStack divider={<Divider />} space="0">
          <VStack space="3">

            <Center my="6">
              <Avatar
                size="xl"
                source={{
                  uri: user?.avatar?.url ? user.avatar.url : '../../assets/EPAROKYA-SYST.png',
                }}
                alt="User Avatar"
              />

              <Text fontSize="xl" fontWeight="bold" color="white" mt="2">
                Welcome, {user?.name || "Guest"}!
              </Text>
            </Center>

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
  const [unreadCount, setUnreadCount] = useState("");
  return (
    <Box safeArea flex={1} bg="#154314" paddingTop={StatusBar.currentHeight || 0}>
      <StatusBar backgroundColor="#154314" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" p="2" bg="#154314">
              {/* Menu Button */}
              <Pressable onPress={() => navigation.toggleDrawer()} p="2">
                <MaterialCommunityIcons name="menu-open" size={30} color="green" />
              </Pressable>

              {/* Notification Bell */}
              {/* <Pressable onPress={() => console.log("Open notifications")}>
                <Box position="relative">
                  <MaterialCommunityIcons name="bell" size={28} color="white" />
                  {unreadCount > 0 && (
                    <Badge
                      colorScheme="danger"
                      rounded="full"
                      position="absolute"
                      top={-2}
                      right={-2}
                      px={1.5}
                      py={0.5}
                    >
                      <Text fontSize="xs" color="white">
                        {unreadCount}
                      </Text>
                    </Badge>
                  )}
                </Box>
              </Pressable> */}
              <NotificationUser />
            </Box>
          ),
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
        <Drawer.Screen name="Home" component={Main} />
        <Drawer.Screen name="Resource Page" component={ResourcePage} />
        <Drawer.Screen name="Calendar" component={CalendarComponent} />
        <Drawer.Screen name="Forms" component={Forms} />
        <Drawer.Screen name="Prayer Wall" component={PrayerWall} />
        <Drawer.Screen name="Live" component={UserLive} />

        {user?.isAdmin && (
          <Drawer.Screen name="Admin Dashboard" component={AdminNavigator} />
        )}
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    </Box>
  );
};

export default DrawerNavigator;
