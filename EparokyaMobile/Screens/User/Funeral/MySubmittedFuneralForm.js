import React, { useEffect, useState } from "react";
import { ScrollView, Image, Alert, TouchableOpacity, Modal, TextInput, StyleSheet, } from "react-native";
import {
  Box,
  VStack,
  Text,
  Heading,
  Divider,
  Button,
  HStack,
  Center,
  Spinner,
  Badge,
  useTheme,
  Linking,
  View,

} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../../assets/common/baseUrl";


const InfoRow = ({ label, value }) => (
  <HStack alignItems="center" mb={1}>
    <Text bold color="primary.700" fontSize="md" minW={120}>
      {label}
    </Text>
    <Text fontSize="md" color="coolGray.800">
      {value}
    </Text>
  </HStack>
);

const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};

const SectionBox = ({ title, children, icon, status }) => (
  <Box
    bg="white"
    p={4}
    borderRadius="xl"
    shadow={2}
    mb={3}
    borderWidth={1}
    borderColor="coolGray.200"
  >
    <HStack alignItems="center" mb={2} space={2}>
      {icon}
      <Heading size="md" color="primary.700">
        {title}
      </Heading>
      {status && (
        <Badge
          colorScheme={
            status === "Cancelled"
              ? "danger"
              : status === "Confirmed"
                ? "success"
                : "warning"
          }
          ml={2}
        >
          {status}
        </Badge>
      )}
    </HStack>
    <Divider mb={2} />
    {children}
  </Box>
);

const MySubmittedFuneralForm = () => {
  const [funeralDetails, setFuneralDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { formId } = route.params || {};
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const [viewImageModal, setViewImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchFuneralDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/getFuneralForm/${formId}`,
          { withCredentials: true }
        );
        setFuneralDetails(response.data);
      } catch (err) {
        setError("Failed to fetch funeral details.");
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchFuneralDetails();
  }, [formId]);

  const handleCancel = async () => {
    setShowModal(true);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert("Error", "Please provide a reason for cancellation.");
      return;
    }
    setCancelLoading(true);
    try {
      await axios.post(
        `${baseURL}/declineFuneral/${formId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      setShowModal(false);
      setCancelReason("");
      Alert.alert("Success", "Funeral request cancelled.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to cancel the funeral request.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading)
    return (
      <Center flex={1}>
        <Spinner size="lg" color="primary.500" />
      </Center>
    );
  if (error)
    return (
      <Center flex={1}>
        <Text color="red.500">{error}</Text>
      </Center>
    );

  return (
    <ScrollView flex={1} bg="coolGray.50" p={4}>
      <VStack space={4}>
        {/* Funeral Details Section */}
        <SectionBox
          title="Funeral Details"
          icon={
            <Text fontSize="2xl" color="primary.600">
              ⚰️
            </Text>
          }
          status={funeralDetails?.funeralStatus}
        >
          <InfoRow label="Name:" value={funeralDetails?.name || "N/A"} />
          <InfoRow label="Age:" value={funeralDetails?.age || "N/A"} />
          <InfoRow
            label="Contact Person:"
            value={funeralDetails?.contactPerson || "N/A"}
          />
          <InfoRow
            label="Relationship:"
            value={funeralDetails?.relationship || "N/A"}
          />
          <InfoRow label="Phone:" value={funeralDetails?.phone || "N/A"} />
          <InfoRow
            label="Address:"
            value={
              [
                funeralDetails?.address?.state,
                funeralDetails?.address?.country,
                funeralDetails?.address?.zip,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"
            }
          />
          <InfoRow
            label="Place of Death:"
            value={funeralDetails?.placeOfDeath || "N/A"}
          />
          <InfoRow
            label="Funeral Date:"
            value={
              funeralDetails?.funeralDate
                ? new Date(funeralDetails.funeralDate).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow label="Time:" value={funeralDetails?.funeraltime || "N/A"} />
          <InfoRow
            label="Service Type:"
            value={funeralDetails?.serviceType || "N/A"}
          />
          <InfoRow
            label="Priest Visit:"
            value={funeralDetails?.priestVisit || "N/A"}
          />
          <InfoRow
            label="Reason of Death:"
            value={funeralDetails?.reasonOfDeath || "N/A"}
          />
          <InfoRow
            label="Funeral Mass Date:"
            value={
              funeralDetails?.funeralMassDate
                ? new Date(funeralDetails.funeralMassDate).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow
            label="Funeral Mass Time:"
            value={funeralDetails?.funeralMasstime || "N/A"}
          />
          <InfoRow
            label="Funeral Mass:"
            value={funeralDetails?.funeralMass || "N/A"}
          />
          <InfoRow
            label="Confirmed At:"
            value={
              funeralDetails?.confirmedAt
                ? new Date(funeralDetails.confirmedAt).toLocaleDateString()
                : "N/A"
            }
          />
        </SectionBox>

        {/* Death Certificate Section */}
        <SectionBox
          title="Death Certificate"
          icon={
            <Text fontSize="2xl" color="primary.600">
              📄
            </Text>
          }
        >
          {funeralDetails?.deathCertificate?.url ? (
            <Center>
              <TouchableOpacity
                onPress={() => {
                  if (isImage(funeralDetails.deathCertificate.url)) {
                    setModalImageUrl(funeralDetails.deathCertificate.url);
                    setViewImageModal(true);
                  } else {
                    Linking.openURL(funeralDetails.deathCertificate.url);
                  }
                }}
                activeOpacity={0.8}
              >
                {isImage(funeralDetails.deathCertificate.url) ? (
                  <Image
                    source={{ uri: funeralDetails.deathCertificate.url }}
                    style={{
                      width: 220,
                      height: 220,
                      resizeMode: "contain",
                      borderRadius: 12,
                      marginVertical: 8,
                      backgroundColor: "#eee",
                    }}
                  />
                ) : (
                  <Box
                    width={220}
                    height={220}
                    borderRadius={12}
                    bg="#eee"
                    alignItems="center"
                    justifyContent="center"
                    marginY={2}
                  >
                    <Text color="primary.700" fontWeight="bold">
                      View File
                    </Text>
                    <Text color="coolGray.500" fontSize="sm" mt={1}>
                      (Tap to open)
                    </Text>
                  </Box>
                )}
              </TouchableOpacity>
            </Center>
          ) : (
            <Text color="coolGray.500">No death certificate uploaded.</Text>
          )}

          {/* Image Modal */}
          <Modal
            visible={viewImageModal}
            transparent
            animationType="fade"
            onRequestClose={() => setViewImageModal(false)}
          >
            <Center
              flex={1}
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 80, right: 20, zIndex: 2 }}
                onPress={() => setViewImageModal(false)}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
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
            </Center>
          </Modal>
        </SectionBox>

        {/* Admin Comments Section */}
        <SectionBox
          title="Admin Comments"
          icon={
            <Text fontSize="2xl" color="primary.600">
              💬
            </Text>
          }
        >
          {funeralDetails?.comments?.length > 0 ? (
            funeralDetails.comments.map((comment, index) => (
              <Box key={index} p={3} bg="coolGray.100" borderRadius="md" mb={2}>
                <InfoRow
                  label="Date:"
                  value={new Date(comment?.createdAt).toLocaleDateString()}
                />
                <InfoRow
                  label="Comment:"
                  value={comment?.selectedComment || "N/A"}
                />
                <InfoRow
                  label="Additional:"
                  value={comment?.additionalComment || "N/A"}
                />
              </Box>
            ))
          ) : (
            <Text color="coolGray.500">No admin comments.</Text>
          )}
        </SectionBox>

        {/* Updated Funeral Date Section */}
        <SectionBox
          title="Updated Funeral Date"
          icon={
            <Text fontSize="2xl" color="primary.600">
              📅
            </Text>
          }
        >
          <InfoRow
            label="Date:"
            value={
              funeralDetails?.adminRescheduled?.date
                ? new Date(
                  funeralDetails.adminRescheduled.date
                ).toLocaleDateString()
                : "N/A"
            }
          />
          {funeralDetails?.adminRescheduled?.reason && (
            <Box mt={2} p={2} bg="coolGray.100" borderRadius="md">
              <Text bold color="primary.700">
                Reason for Rescheduling
              </Text>
              <Text color="coolGray.800">
                {funeralDetails.adminRescheduled.reason}
              </Text>
            </Box>
          )}
        </SectionBox>

        {/* Priest Section */}
        <SectionBox
          title="Assigned Priest"
          icon={
            <Text fontSize="2xl" color="primary.600">
              ⛪
            </Text>
          }
        >
          <Text fontSize="md" color="coolGray.800">
           {funeralDetails?.Priest?.title } {funeralDetails?.Priest?.fullName || "No priest assigned"}
          </Text>
        </SectionBox>

        {/* Cancel Button */}
        <Box p={4} borderRadius={8} >
          <Button
            style={[
              styles.cancelButton,
              (funeralDetails.funeralStatus === "Confirmed" || funeralDetails.funeralStatus === "Cancelled") && styles.cancelButtonDisabled
            ]}
            onPress={handleCancel}

            disabled={
              funeralDetails?.funeralStatus === "Cancelled" ||
              funeralDetails?.funeralStatus === "Approved"
            }>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Cancel Wedding
            </Text>

          </Button>
        </Box>

        {funeralDetails?.funeralStatus === "Cancelled" && (
          <Box p={4} borderWidth={1} borderRadius={8} mt={4} mb={10} margin={10}>
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              Funeral has been cancelled.
            </Text>
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              Reason: {funeralDetails?.funeralStatus?.reason || "N/A"}
            </Text>
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              From: {funeralDetails?.funeralStatus?.user || "N/A"}
            </Text>
          </Box>
        )}
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

      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: "#e53935", // red
    padding: 10,
    borderRadius: 6,
  },
  cancelButtonDisabled: {
    backgroundColor: "#ccc", // light gray when disabled
  },
}
)

export default MySubmittedFuneralForm;