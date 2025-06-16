import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Image } from "react-native";
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
import Login from "../Screens/User/Login";
import Main from "./Main";
import AdminNavigator from "./AdminNavigator";
import CalendarComponent from "../Screens/Calendar/Calendar";
import MinistryAnnouncement from "../Screens/User/MinistryAnnouncement";
import Forms from "../Screens/User/UserForms";
import Profile from "../Screens/User/Profile";
import PrayerWall from "../Screens/Prayers/PrayerWall";
import SendPrayer from "../Screens/Forms/Prayers/PrayerRequestIntentionForm";
import ResourcePage from "../Screens/Resource/ResourcePage";
import UserLive from "../Screens/User/UserLive";
import { ChevronDownIcon, ChevronUpIcon } from "native-base";
import MemberDirectory from "../Screens/MemberDirectory";
import ParishPriests from "../Screens/ParishPriests";
import SentimentReports from "../Screens/SentimentReports";
import WeddingWall from "../Screens/WeddingWall"
import EventSentiment from "../Screens/../Screens/User/FeedbackForm.js/EventSentiment";
import ActivitySentiment from "../Screens/../Screens/User/FeedbackForm.js/ActivitySentiment";
import PriestSentiment from "../Screens/../Screens/User/FeedbackForm.js/PriestSentiment";
import { useState } from "react";
import NotificationUser from "../service/notificationUser";
import MinistryCalendar from "../Screens/Calendar/MinistryCalendar";
import MassReadingsModal from "../service/Readings";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Resource Page":
      return "book-open-variant";
    case "Member Directory":
      return "account-group";
    case "Parish Priests":
      return "account-tie";
    case "Calendar":
      return "calendar";
    case "Ministry Calendar":
      return "calendar-multiselect";
    case "Forms":
      return "form-select";
    case "Prayer Wall":
      return "hands-pray";
      case "Wedding Wall":
      return "cards-heart";
    case "Send Prayer":
      return "hand-heart";
    case "Feedback Reports":
      return "chart-box";
    case "Profile":
      return "account-circle";
    case "Live":
      return "video";
    case "Ministry Announcement":
      return "bullhorn";
    default:
      return help-circle;
  }
};

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [expandedSections, setExpandedSections] = useState({});
  const [availableForms, setAvailableForms] = useState([]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const sections = {
    "Community": ["Home", "Member Directory", "Parish Priests"],
    "Events": ["Calendar", "Ministry Calendar", "Ministry Announcement"],
    "Prayers": ["Prayer Wall", "Wedding Wall", "Send Prayer"],
    "Resources": ["Resource Page", "Forms"],
    "Account": ["Profile"]
  };

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

  const handleLogout = () => {
    dispatch(logoutAction());
    props.navigation.navigate("Login");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <VStack space="0" my="0" mx="0" bg="#154314" flex={1}>
        {/* User Profile Section */}
        <Center my="6" px="4">
          <Avatar
            size="xl"
            source={{
              uri: user?.avatar?.url || require("../assets/EPAROKYA-SYST.png"),
            }}
            alt="User Avatar"
            borderWidth={2}
            borderColor="white"
          />
          <Text fontSize="xl" fontWeight="bold" color="white" mt="2">
            {user?.name || "Guest"}
          </Text>
          <Text fontSize="sm" color="white" opacity={0.8}>
            {user?.email || ""}
          </Text>
        </Center>

        {/* Navigation Sections */}
        <VStack space="0" flex={1}>
          {Object.entries(sections).map(([sectionName, items]) => (
            <Box key={sectionName}>
              <Pressable
                px="5"
                py="3"
                onPress={() => toggleSection(sectionName)}
                _pressed={{ bg: "rgba(255,255,255,0.1)" }}
              >
                <HStack space="4" alignItems="center" justifyContent="space-between">
                  <HStack space="4" alignItems="center">
                    <Icon
                      color="white"
                      size="5"
                      as={<MaterialCommunityIcons name={getIcon(items[0])} />}
                    />
                    <Text
                      fontWeight="500"
                      color="white"
                      fontSize="md"
                    >
                      {sectionName}
                    </Text>
                  </HStack>
                  <Icon
                    as={MaterialCommunityIcons}
                    name={expandedSections[sectionName] ? "chevron-up" : "chevron-down"}
                    size="5"
                    color="white"
                  />
                </HStack>
              </Pressable>

              {expandedSections[sectionName] && (
                <VStack space="0" pl="12">
                  {items.map((name, index) => (
                    <Pressable
                      key={name}
                      px="4"
                      py="3"
                      bg={props.state.routeNames[props.state.index] === name ? "#b3cf99" : "transparent"}
                      onPress={() => props.navigation.navigate(name)}
                      _pressed={{ bg: "rgba(255,255,255,0.1)" }}
                    >
                      <HStack space="4" alignItems="center">
                        <Icon
                          color={props.state.routeNames[props.state.index] === name ? "white" : "gray.300"}
                          size="5"
                          as={<MaterialCommunityIcons name={getIcon(name)} />}
                        />
                        <Text
                          fontWeight="500"
                          color={props.state.routeNames[props.state.index] === name ? "white" : "gray.300"}
                          fontSize="md"
                        >
                          {name}
                        </Text>
                      </HStack>
                    </Pressable>
                  ))}
                </VStack>
              )}
              <Divider bg="rgba(255,255,255,0.1)" />
            </Box>
          ))}
        </VStack>

        {/* Logout Button */}
        {user && (
          <Pressable
            px="5"
            py="3"
            mt="auto"
            mb="4"
            onPress={handleLogout}
            _pressed={{ bg: "rgba(255,255,255,0.1)" }}
          >
            <HStack space="4" alignItems="center">
              <Icon
                color="white"
                size="5"
                as={<MaterialCommunityIcons name="logout" />}
              />
              <Text
                fontWeight="500"
                color="white"
                fontSize="md"
              >
                Logout
              </Text>
            </HStack>
          </Pressable>
        )}
      </VStack>

      {/* Feedback Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Active Feedback Form</Text>
            {activeFeedback ? (
              <>
                <View style={styles.modalRow}>
                  <MaterialCommunityIcons name="format-list-checks" size={20} color="#26572E" />
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Category:</Text>{" "}
                    {activeFeedback.category || "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#26572E" />
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Date:</Text>{" "}
                    {activeFeedback.date || "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <MaterialCommunityIcons name="clock" size={20} color="#26572E" />
                  <Text style={styles.modalText}>
                    <Text style={styles.modalLabel}>Time:</Text>{" "}
                    {activeFeedback.time || "N/A"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleNavigateToSentiment}
                >
                  <Text style={styles.modalButtonText}>Go to Feedback Form</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.modalText}>No active feedback form available.</Text>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <Box safeArea flex={1} bg="#154314">
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
              p="3"
              bg="#154314"
              borderBottomWidth={1}
              borderBottomColor="rgba(255,255,255,0.1)"
            >
              {/* Menu Button */}
              <Pressable 
                onPress={() => navigation.toggleDrawer()} 
                p="2"
                _pressed={{ bg: "rgba(255,255,255,0.1)" }}
              >
                <MaterialCommunityIcons
                  name="menu"
                  size={28}
                  color="white"
                />
              </Pressable>

              {/* <Image
                source={require("../assets/EPAROKYA-SYST.png")}
                style={{ width: 120, height: 30, resizeMode: 'contain' }}
              /> */}

              <HStack space={4} alignItems="center">
                <MassReadingsModal />
                <NotificationUser />
              </HStack>
            </Box>
          ),
          drawerStyle: {
            backgroundColor: "#154314",
            width: "85%",
          },
          drawerType: "slide",
          overlayColor: "rgba(0,0,0,0.5)",
        })}
      >
        <Drawer.Screen 
          name="Home" 
          component={Main} 
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen name="Resource Page" component={ResourcePage} />
        <Drawer.Screen name="Member Directory" component={MemberDirectory} />
        <Drawer.Screen name="Ministry Announcement" component={MinistryAnnouncement} />
        <Drawer.Screen name="Parish Priests" component={ParishPriests} />
        <Drawer.Screen name="Calendar" component={CalendarComponent} />
        <Drawer.Screen name="Ministry Calendar" component={MinistryCalendar} />
        <Drawer.Screen name="Forms" component={Forms} />
        <Drawer.Screen name="Prayer Wall" component={PrayerWall} />
         <Drawer.Screen name="Wedding Wall" component={WeddingWall} />
        <Drawer.Screen name="Send Prayer" component={SendPrayer} />
        <Drawer.Screen name="Live" component={UserLive} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="PriestSentiment" component={PriestSentiment} />
        <Drawer.Screen name="EventSentiment" component={EventSentiment} />
        <Drawer.Screen name="ActivitySentiment" component={ActivitySentiment} />
        <Drawer.Screen name="Feedback Reports" component={SentimentReports} />
      </Drawer.Navigator>
    </Box>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#26572E',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  modalText: {
    marginLeft: 8,
    color: '#555',
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#26572E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 12,
  },
  modalCloseText: {
    color: '#888',
  },
});

export default DrawerNavigator;