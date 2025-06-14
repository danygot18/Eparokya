import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
  Button
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {  VStack, Heading, Spinner, Box, HStack } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import UserBaptismChecklist from "./BaptismChecklist";

// Set up which files/images to show in the Images tab
const imageFields = [
  {
    label: "Birth Certificate",
    key: "birthCertificate",
    parent: "Docs",
  },
  {
    label: "Marriage Certificate",
    key: "marriageCertificate",
    parent: "Docs",
  },
  {
    label: "Baptismal Permit",
    key: "baptismPermit",
    parent: "additionalDocs",
  },
  {
    label: "Certificate of No Record Baptism",
    key: "certificateOfNoRecordBaptism",
    parent: "additionalDocs",
  },
];

const tabLabels = ["Form Details", "Images & Files", "Comments", "Checklist"];

const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MySubmittedBaptismForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { formId } = route.params;
  const [baptismDetails, setBaptismDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Image modal state
  const [viewImageModal, setViewImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  useEffect(() => {
    fetchBaptismDetails();
  }, []);

  const fetchBaptismDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/getBaptismForm/${formId}`);
      setBaptismDetails(response.data);
      
    } catch (err) {
      setError("Failed to fetch baptism details.");
    } finally {
      setLoading(false);
    }
  };



  const handleCancel = async () => {
    setShowModal(true);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert("Error", "Please provide a reason for cancellation.");
      return;
    }
    try {
      await axios.post(
        `${baseURL}/declineBaptism/${formId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      setShowModal(false);
      setCancelReason("");
      Alert.alert("Success", "Baptism cancelled successfully!");
      fetchBaptismDetails();
    } catch (error) {
      Alert.alert("Error", "Failed to cancel the Baptism.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="lg" />
      </View>
    );
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderRadius: 12,
          margin: 8,
          overflow: "hidden",
          elevation: 2,
        }}
      >
        {tabLabels.map((label, idx) => (
          <TouchableOpacity
            key={label}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              backgroundColor: activeTab === idx ? "#154314" : "#f4f4f4",
            }}
            onPress={() => setActiveTab(idx)}
          >
            <Text
              style={{
                color: activeTab === idx ? "#fff" : "#333",
                fontWeight: "bold",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content    */}
      {activeTab === 0 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <VStack space={4}>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Text>Status: {baptismDetails?.binyagStatus}</Text>
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">User Information</Heading>
              <Text>
                User:{" "}
                {baptismDetails?.userId?.name ||
                  baptismDetails?.userId?.fullName ||
                  "N/A"}
              </Text>
              <Text>Contact Number: {baptismDetails?.phone || "N/A"}</Text>
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Baptism Information</Heading>
              <Text>
                Baptism Date: {formatDate(baptismDetails?.baptismDate)}
              </Text>
              <Text>Baptism Time: {baptismDetails?.baptismTime || "N/A"}</Text>
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Child Information</Heading>
              <Text>
                Child Name: {baptismDetails?.child?.fullName || "N/A"}
              </Text>
              <Text>
                Birthdate: {formatDate(baptismDetails?.child?.dateOfBirth)}
              </Text>
              <Text>
                Place of Birth: {baptismDetails?.child?.placeOfBirth || "N/A"}
              </Text>
              <Text>Sex: {baptismDetails?.child?.gender || "N/A"}</Text>
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Parents Information</Heading>
              <Text>
                Father: {baptismDetails?.parents?.fatherFullName || "N/A"}
              </Text>
              <Text>
                Place of Father's Birth:{" "}
                {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}
              </Text>
              <Text>
                Mother: {baptismDetails?.parents?.motherFullName || "N/A"}
              </Text>
              <Text>
                Place of Mother's Birth:{" "}
                {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}
              </Text>
              <Text>Address: {baptismDetails?.parents?.address || "N/A"}</Text>
              <Text>
                Marriage Status:{" "}
                {baptismDetails?.parents?.marriageStatus || "N/A"}
              </Text>
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Ninong</Heading>
              {Array.isArray(baptismDetails?.ninong) ? (
                baptismDetails.ninong.map((ninong, idx) => (
                  <View key={idx}>
                    <Text>
                      Name: {ninong?.fullName || ninong?.name || "N/A"}
                    </Text>
                    <Text>Address: {ninong?.address || "N/A"}</Text>
                    <Text>Religion: {ninong?.religion || "N/A"}</Text>
                  </View>
                ))
              ) : (
                <>
                  <Text>
                    Name:{" "}
                    {baptismDetails?.ninong?.fullName ||
                      baptismDetails?.ninong?.name ||
                      "N/A"}
                  </Text>
                  <Text>
                    Address: {baptismDetails?.ninong?.address || "N/A"}
                  </Text>
                  <Text>
                    Religion: {baptismDetails?.ninong?.religion || "N/A"}
                  </Text>
                </>
              )}
            </Box>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff" mb={6}>
              <Heading size="md">Ninang</Heading>
              {Array.isArray(baptismDetails?.ninang) ? (
                baptismDetails.ninang.map((ninang, idx) => (
                  <View key={idx}>
                    <Text>
                      Name: {ninang?.fullName || ninang?.name || "N/A"}
                    </Text>
                    <Text>Address: {ninang?.address || "N/A"}</Text>
                    <Text>Religion: {ninang?.religion || "N/A"}</Text>
                  </View>
                ))
              ) : (
                <>
                  <Text>
                    Name:{" "}
                    {baptismDetails?.ninang?.fullName ||
                      baptismDetails?.ninang?.name ||
                      "N/A"}
                  </Text>
                  <Text>
                    Address: {baptismDetails?.ninang?.address || "N/A"}
                  </Text>
                  <Text>
                    Religion: {baptismDetails?.ninang?.religion || "N/A"}
                  </Text>
                </>
              )}
            </Box>

          </VStack>

        </ScrollView>
      )}
      {activeTab === 1 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          {imageFields.map(({ label, key, parent }) => {
            const parentObj = baptismDetails?.[parent];
            const docItem = parentObj ? parentObj[key] : null;
            if (!docItem?.url) return null;
            return (
              <View
                key={key}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  elevation: 2,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {label}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (isImage(docItem.url)) {
                      setModalImageUrl(docItem.url);
                      setViewImageModal(true);
                    } else {
                      Linking.openURL(docItem.url);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  {isImage(docItem.url) ? (
                    <Image
                      source={{ uri: docItem.url }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        backgroundColor: "#eee",
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        backgroundColor: "#eee",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#154314", fontWeight: "bold" }}>
                        View File
                      </Text>
                      <Text
                        style={{ color: "#888", fontSize: 12, marginTop: 4 }}
                      >
                        (Tap to open)
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
          {/* Image Modal */}
          <Modal
            visible={viewImageModal}
            transparent
            animationType="fade"
            onRequestClose={() => setViewImageModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 40, right: 30, zIndex: 2 }}
                onPress={() => setViewImageModal(false)}
              >
                <Text style={{ color: "#fff", fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: modalImageUrl }}
                style={{
                  width: "90%",
                  height: "70%",
                  borderRadius: 12,
                  resizeMode: "contain",
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </Modal>
        </ScrollView>
      )}
      {activeTab === 2 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              elevation: 2,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
            >
              Admin Comments
            </Text>
            {baptismDetails?.comments?.length > 0 ? (
              baptismDetails.comments.map((comment, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Comment:</Text>{" "}
                    {comment?.selectedComment || "N/A"}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Additional:</Text>{" "}
                    {comment?.additionalComment || "N/A"}
                  </Text>
                  <Text style={{ color: "#888", fontSize: 12 }}>
                    {formatDate(comment?.createdAt)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#888" }}>No admin comments yet.</Text>
            )}
          </View>
          <View style={{ marginBottom: 12 }}>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Additional Comment</Heading>
              {baptismDetails?.adminNotes?.length > 0 ? (
                baptismDetails.adminNotes.map((note, index) => (
                  <Box key={index} mb={2}>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Priest:</Text>{" "}
                      {note?.priest.fullName || "No priest."}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Recorded By:</Text>{" "}
                      {note?.recordedBy || "No record."}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Book Number:</Text>{" "}
                      {note?.bookNumber || "No book number."}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Page Number:</Text>{" "}
                      {note?.pageNumber || "No page number."}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Line Number:</Text>{" "}
                      {note?.lineNumber || "No line number."}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No admin notes available.</Text>
              )}
            </Box>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Box p={4} borderWidth={1} borderRadius={8} backgroundColor="#fff">
              <Heading size="md">Updated Baptism Date</Heading>
              <Text>
                {baptismDetails?.adminRescheduled
                  ? formatDate(baptismDetails.adminRescheduled.date)
                  : "N/A"}
              </Text>
              {baptismDetails?.adminRescheduled?.reason && (
                <Box mt={2}>
                  <Heading size="sm">Reason for Rescheduling</Heading>
                  <Text>{baptismDetails.adminRescheduled.reason}</Text>
                </Box>
              )}
            </Box>
          </View>
          <Button
            title="Cancel Baptism"
            color="red"
            onPress={handleCancel}
            disabled={
              baptismDetails?.binyagStatus === "Cancelled" ||
              baptismDetails?.binyagStatus === "Confirmed"
            }
          />
          <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <View style={{
                backgroundColor: "#fff",
                padding: 24,
                borderRadius: 12,
                width: "85%"
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                  Reason for Cancellation
                </Text>
                <TextInput
                  placeholder="Enter reason"
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    minHeight: 60,
                    marginBottom: 16
                  }}
                  multiline
                />
                <HStack justifyContent="flex-end" space={2}>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      backgroundColor: "#eee",
                      borderRadius: 8,
                      marginRight: 8
                    }}
                    disabled={cancelLoading}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={submitCancel}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      backgroundColor: "#d32f2f",
                      borderRadius: 8
                    }}
                    disabled={cancelLoading}
                  >
                    <Text style={{ color: "#fff" }}>
                      {cancelLoading ? "Cancelling..." : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </View>
            </View>
          </Modal>
          {baptismDetails?.binyagStatus === "Cancelled" && (
            <Box p={4} borderWidth={1} borderRadius={8} mt={4} mb={10}>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                Counseling has been cancelled.
              </Text>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                Reason: {baptismDetails?.cancellingReason?.reason || "N/A"}
              </Text>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                From: {baptismDetails?.cancellingReason?.user || "N/A"}
              </Text>
            </Box>
          )}
        </ScrollView>
      )}
      {activeTab === 3 && (
        <View style={{ flex: 1, padding: 16 }}>
          <UserBaptismChecklist formId={formId} />
        </View>
      )}
    </View>
  );
};

export default MySubmittedBaptismForm;
