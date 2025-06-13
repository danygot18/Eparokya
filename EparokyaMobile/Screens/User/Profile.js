import React, { useState, useEffect, useCallback } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Card, Avatar, Button } from "tamagui";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { removeAuth } from "../../State/authSlice";
import { format } from "date-fns";

const UserProfile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const defaultImage = "https://rb.gy/hnb4yc";

  const getProfile = async () => {
    if (!token) {
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
    } catch (error) {
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      getProfile();
    }, [])
  );

  const handleLogout = async () => {
    dispatch(removeAuth());
    navigation.navigate("Login");
  };

  if (loading || !userProfile) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="#fff">
        <Text fontSize={18}>Loading...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <YStack space="$4" p="$4" alignItems="center">
        {/* Profile Header: Avatar, Name, Joined Date aligned horizontally */}
        <XStack alignItems="center" space="$4" mb="$2">
          <Avatar circular size="$8">
            <Avatar.Image
              source={{ uri: userProfile?.avatar?.url || defaultImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </Avatar>
          <YStack>
            <Text fontSize={24} fontWeight="bold">
              {userProfile?.name}
            </Text>
            <Text color="#888" fontSize={14}>
              Joined: {userProfile?.createdAt?.slice(0, 10)}
            </Text>
          </YStack>
        </XStack>

        {/* Info Cards */}
        <YStack space="$2" w="100%" maxWidth={400}>
          <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7">
            <XStack alignItems="center" space="$2">
              <MaterialIcons name="email" size={22} color="#26572E" />
              <Text fontSize={16}>{userProfile?.email}</Text>
            </XStack>
          </Card>
          <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7">
            <XStack alignItems="center" space="$2">
              <MaterialIcons name="phone" size={22} color="#26572E" />
              <Text fontSize={16}>{userProfile?.phone || "No phone"}</Text>
            </XStack>
          </Card>
          <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7">
            <XStack alignItems="center" space="$2">
              <MaterialIcons name="cake" size={22} color="#26572E" />
              <Text fontSize={16}>
                {userProfile?.birthDate
                  ? format(new Date(userProfile.birthDate), "MMMM d, yyyy") // Example: June 14, 2025
                  : "No birth date"}
              </Text>
            </XStack>
          </Card>
          <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7">
            <XStack alignItems="center" space="$2">
              <MaterialIcons name="favorite" size={22} color="#26572E" />
              <Text fontSize={16}>
                {userProfile?.preference || "No preference"}
              </Text>
            </XStack>
          </Card>
          <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7">
            <XStack alignItems="flex-start" space="$2">
              <MaterialIcons name="home" size={22} color="#26572E" />
              {userProfile?.address ? (
                <Text fontSize={16}>
                  {[
                    userProfile.address.BldgNameTower,
                    userProfile.address.LotBlockPhaseHouseNo,
                    userProfile.address.SubdivisionVillageZone,
                    userProfile.address.Street,
                    userProfile.address.District,
                    userProfile.address.barangay === "Others"
                      ? userProfile.address.customBarangay || "Others"
                      : userProfile.address.barangay,
                    userProfile.address.city === "Others"
                      ? userProfile.address.customCity || "Others"
                      : userProfile.address.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              ) : (
                <Text fontSize={16}>No Address</Text>
              )}
            </XStack>
          </Card>
        </YStack>

        <Card p="$3" borderRadius={12} backgroundColor="#f7f7f7" w="100%" >
          <XStack alignItems="center" space="$2" mb="$2">
            <MaterialIcons name="group" size={22} color="#26572E" />
            <Text fontSize={16} fontWeight="bold">
              Ministry Roles
            </Text>
          </XStack>
          {userProfile?.ministryRoles?.length > 0 ? (
            userProfile.ministryRoles.map((role, idx) => (
              <YStack key={idx} mb="$2" ml="$4">
                <Text fontSize={15}>
                  Ministry: <Text fontWeight="bold">{role.ministry.name}</Text>
                </Text>
                <Text fontSize={15}>
                  Role: <Text fontWeight="bold">{role.role}</Text>
                </Text>
                <Text fontSize={15}>
                  Start Year: <Text fontWeight="bold">{role.startYear}</Text>
                </Text>
                <Text fontSize={15}>
                  End Year:{" "}
                  <Text fontWeight="bold">{role.endYear || "Present"}</Text>
                </Text>
              </YStack>
            ))
          ) : (
            <Text color="#888" ml="$4">
              No ministry roles assigned
            </Text>
          )}
        </Card>

        <XStack
          space="$4"
          mt="$4"
          w="100%"
          maxWidth={400}
          justifyContent="center"
        >
          <Button
            circular
            size="$5"
            backgroundColor="#154314"
            onPress={() => navigation.navigate("UpdateProfile")}
            icon={
              <MaterialIcons name="app-registration" size={28} color="#fff" />
            }
            aria-label="Edit Profile"
          />
          <Button
            circular
            size="$5"
            backgroundColor="#154314"
            onPress={() => navigation.navigate("SubmittedForms")}
            icon={<MaterialIcons name="summarize" size={28} color="#fff" />}
            aria-label="My Forms"
          />
          <Button
            circular
            size="$5"
            backgroundColor="#d32f2f"
            onPress={handleLogout}
            icon={<MaterialIcons name="logout" size={28} color="#fff" />}
            aria-label="Logout"
          />
        </XStack>
      </YStack>
    </ScrollView>
  );
};

export default UserProfile;
