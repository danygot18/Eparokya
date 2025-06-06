import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

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
import SendPrayer from "../Screens/Forms/Prayers/PrayerRequestIntentionForm";
import ResourcePage from "../Screens/Resource/ResourcePage";
import UserLive from "../Screens/User/UserLive";
import { ChevronDownIcon, ChevronUpIcon } from "native-base";
import MemberDirectory from "../Screens/MemberDirectory";
import ParishPriests from "../Screens/ParishPriests";

import SentimentReports from "../Screens/SentimentReports";
import EventSentiment from "../Screens/../Screens/User/FeedbackForm.js/EventSentiment";
import ActivitySentiment from "../Screens/../Screens/User/FeedbackForm.js/ActivitySentiment";
import PriestSentiment from "../Screens/../Screens/User/FeedbackForm.js/PriestSentiment";


import { useState } from "react";
import NotificationUser from "../service/notificationUser";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Resource Page":
      return "calendar";
    case "Member Directory":
      return "account-multiple";
    case "Parish Priests":
      return "account-multiple";
    case "Calendar":
      return "calendar";
    case "Forms":
      return "file-document";
    case "Prayer Wall":
      return "book-open-page-variant";
    case "Send Prayer":
      return "book-open-page-variant";
    case "Sentiment Reports":
      return "chart-bar";
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
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
useEffect(() => {
  const fetchActiveFeedback = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin-selections/active`);
      if (response.data && response.data.isActive) {
        setActiveFeedback(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching active feedback form:", error);
    }
  };
  fetchActiveFeedback();
}, []);

const handleNavigateToSentiment = () => {
  setModalVisible(false);
  if (activeFeedback) {
    let route = "";
    switch (activeFeedback.category) {
      case "priest":
        route = "PriestSentiment";
        break;
      case "event":
        route = "EventSentiment";
        break;
      case "activities":
        route = "ActivitySentiment";
        break;
      default:
        return;
    }
    props.navigation.navigate(route, { activeFeedback });
  }
};
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="0" my="0" mx="0" bg="#154314">
        <VStack divider={<Divider />} space="0">
          <VStack space="3">
            <Center my="6">
              <Avatar
                size="xl"
                source={{
                  uri: user?.avatar?.url
                    ? user.avatar.url
                    : "../../assets/EPAROKYA-SYST.png",
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 24,
              width: 320,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 8,
                color: "#26572E",
              }}
            >
              Active Feedback Form
            </Text>
            {activeFeedback ? (
              <>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>Category:</Text>{" "}
                  {activeFeedback.category || "N/A"}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
                  {activeFeedback.date || "N/A"}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>Time:</Text>{" "}
                  {activeFeedback.time || "N/A"}
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 16,
                    backgroundColor: "#26572E",
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                  }}
                  onPress={handleNavigateToSentiment}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Go to Feedback Form
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>No active feedback form available.</Text>
            )}
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#888" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState("");
  return (
    <Box
      safeArea
      flex={1}
      bg="#154314"
      paddingTop={StatusBar.currentHeight || 0}
    >
      <StatusBar backgroundColor="#154314" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              p="2"
              bg="#154314"
            >
              {/* Menu Button */}
              <Pressable onPress={() => navigation.toggleDrawer()} p="2">
                <MaterialCommunityIcons
                  name="menu-open"
                  size={30}
                  color="green"
                />
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
        <Drawer.Screen name="Member Directory" component={MemberDirectory} />
        <Drawer.Screen name="Parish Priests" component={ParishPriests} />

        <Drawer.Screen name="Calendar" component={CalendarComponent} />
        <Drawer.Screen name="Forms" component={Forms} />
        <Drawer.Screen name="Prayer Wall" component={PrayerWall} />
        <Drawer.Screen name="SendPrayer" component={SendPrayer} />
        <Drawer.Screen name="Live" component={UserLive} />

        <Drawer.Screen name="Profile" component={Profile} />

        <Drawer.Screen
          name="PriestSentiment"
          component={PriestSentiment}
        />
        <Drawer.Screen name="EventSentiment" component={EventSentiment} />
        <Drawer.Screen
          name="ActivitySentiment"
          component={ActivitySentiment}
        />
        <Drawer.Screen name="Feedback Reports" component={SentimentReports} />
      </Drawer.Navigator>
    </Box>
  );
};

export default DrawerNavigator;
