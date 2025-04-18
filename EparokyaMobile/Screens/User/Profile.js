import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,

} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import SyncStorage from "sync-storage";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../Redux/Actions/userActions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FormContainer from "../../Shared/Form/FormContainer";
import * as ImagePicker from "expo-image-picker";

import { removeAuth } from "../../State/authSlice";

const UserProfile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  const defaultImage = "https://rb.gy/hnb4yc";

  const getProfile = async () => {
    console.log(token)
    if (!token) {
      // setIsAuthenticated(false);
      navigation.navigate("Login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/profile`, config);
      setUserProfile(data?.user);
      console.log(data?.user)
      console.log(data?.user.ministryRoles)
    } catch (error) {
      console.error(error);
      // setIsAuthenticated(false);
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsAuthenticated(true);
      setLoading(false);
      getProfile();
      console.log(token)
    }, [])
  );

  const handleLogout = async () => {
    dispatch(removeAuth())
    navigation.navigate("Login");

  };

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileSection}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={{ uri: userProfile?.avatar?.url || defaultImage }}
            style={styles.profileImage}
          />
        )}
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{userProfile?.name}</Text>
          <Text style={styles.joinedLabel}>
            Joined: {userProfile?.createdAt?.slice(0, 10)}
          </Text>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <MaterialIcons name="email" size={24} color="#333" />
        <Text style={styles.infoText}>{userProfile?.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <MaterialIcons name="phone" size={24} color="#333" />
        <Text style={styles.infoText}>{userProfile?.phone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <MaterialIcons name="info" size={24} color="#333" />
        <Text style={styles.infoText}>{userProfile?.birthDate}</Text>
      </View>
      <View style={styles.infoContainer}>
        <MaterialIcons name="info" size={24} color="#333" />
        <Text style={styles.infoText}>{userProfile?.preference}</Text>
      </View>
      <View style={styles.infoContainer}>
        <MaterialIcons name="home" size={24} color="#333" />
        <Text style={styles.infoText}>
          {userProfile?.address?.city || "No city"},
          {userProfile?.address?.barangay || "No barangay"},
          {userProfile?.address?.zip || "No zip"},
          {userProfile?.country || "No country"}
        </Text>
      </View>

      {/* Display Ministry Category */}
      <View style={styles.infoContainer}>
        <MaterialIcons name="group" size={24} color="#333" />
        <View style={{ marginLeft: 10 }}>
          {userProfile?.ministryRoles?.length > 0
            ? userProfile.ministryRoles.map((role, index) => (
              <Text key={index} style={styles.infoText}>
                {`Ministry: ${role.ministry.name}\n`}
                {`Role: ${role.role}\n`}
                {`Start Year: ${role.startYear}\n`}
                {`End Year: ${role.endYear}\n`}
              </Text>
            ))
            : <Text style={styles.infoText}>No ministry roles assigned</Text>}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UpdateProfile")}
          style={styles.actionButton}
        >
          <MaterialIcons name="app-registration" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SubmittedForms")}
          style={styles.actionButton}
        >
          <MaterialIcons name="summarize" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.actionButton}
        >
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  nameContainer: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#333",
  },
  joinedLabel: {
    fontSize: 14,
    color: "gray",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "90%",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 10,
    fontFamily: "Roboto",
    color: "#333",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: "#154314",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
});

export default UserProfile;
