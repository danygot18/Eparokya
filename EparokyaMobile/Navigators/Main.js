import React from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import UserNavigator from "./UserNavigator";
import Home from "./Home";
import WeddingNavigator from "./WeddingNavigator";
import FormsNavigator from "./FormsNavigator";
import UserForms from "../Screens/User/UserForms";
import ChatNavigator from "./ChatNavigator";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const scale = new Animated.Value(isFocused ? 1.5 : 1);

        React.useEffect(() => {
          Animated.timing(scale, {
            toValue: isFocused ? 1.5 : 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, [isFocused]);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabButton,
              isFocused && styles.focusedTabButton,
              index === 1 && styles.centralTab,
            ]}
          >
            <Animated.View
              style={[
                {
                  transform: [{ scale }],
                },
              ]}
            >
              <Icon
                name={route.name === "HomeTab" ? "home" : route.name === "Forms" ? "leaf" : "user"}
                size={isFocused ? 20 : 19} 
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
    initialRouteName="HomeTab"
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Forms" component={FormsNavigator} />
    <Tab.Screen name="Profile" component={UserNavigator} />
    <Tab.Screen name="ChatNavigator" component={ChatNavigator} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  centralTab: {
    position: "relative",
    bottom: 20,
    backgroundColor: "#E8F5E9",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  focusedTabButton: {
    backgroundColor: "#F1F8E9",
    borderRadius: 30,
  },
  tabLabel: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 4,
  },
});

export default Main;
