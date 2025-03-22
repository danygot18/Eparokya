import React from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import UserNavigator from "./UserNavigator";
import Home from "./Home";
import FormsNavigator from "./FormsNavigator";
import ChatNavigator from "./ChatNavigator";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        const scale = new Animated.Value(isFocused ? 1.2 : 1);
        React.useEffect(() => {
          Animated.timing(scale, {
            toValue: isFocused ? 1.5 : 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, [isFocused]);

        const getIconName = (routeName) => {
          switch (routeName) {
            case "Home":
              return "home-heart";
            case "Forms":
              return "file-document";
            case "Profile":
              return "account";
            case "Chats":
              return "chat";
            default:
              return "help";
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabButton,
              isFocused && styles.focusedTabButton,
            ]}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <MaterialCommunityIcons
                name={getIconName(route.name)}
                size={isFocused ? 26 : 22}
                color={isFocused ? "#4CAF50" : "gray"}
              />
            </Animated.View>
            {isFocused && <Text style={styles.tabLabel}>{label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Main = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Forms" component={FormsNavigator} />
    <Tab.Screen name="Chats" component={ChatNavigator} />
    <Tab.Screen name="Profile" component={UserNavigator} />
    
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 65,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  focusedTabButton: {
    backgroundColor: "#F1F8E9",
    borderRadius: 30,
    paddingVertical: 6,
  },
  tabLabel: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 4,
  },
});

export default Main;
