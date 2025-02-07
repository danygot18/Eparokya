import React, { useEffect, useState } from "react";
import { ScrollView, Image, Alert } from "react-native";
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
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from '../../../assets/common/baseUrl';


const MySubmittedFuneralForm = () => {
  const [funeralDetails, setFuneralDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { formId } = route.params || {}; // Get formId from navigation params
  const { user } = useSelector((state) => state.auth);

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
    try {
        await axios.put(
            `${baseURL}/declineFuneral/${formId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                withCredentials: true
            }
        );
        Alert.alert("Success", "Funeral request cancelled.");
        navigation.goBack();
    } catch (error) {
        console.error('Error cancelling funeral request:', error);
        Alert.alert("Error", "Failed to cancel the funeral request.");
    }
};

  if (loading) return <Center flex={1}><Spinner size="lg" /></Center>;
  if (error) return <Center flex={1}><Text color="red.500">{error}</Text></Center>;

  return (
    <ScrollView flex={1} bg="white" p={4}>
      <VStack space={4}>
        {/* Funeral Details Section */}
        <Box bg="gray.100" p={4} borderRadius="lg">
          <Heading size="md" mb={2}>Funeral Details</Heading>
          <Divider />
          <Text><Text bold>Name:</Text> {funeralDetails?.name || "N/A"}</Text>
          <Text><Text bold>Age:</Text> {funeralDetails?.age || "N/A"}</Text>
          <Text><Text bold>Contact Person:</Text> {funeralDetails?.contactPerson || "N/A"}</Text>
          <Text><Text bold>Relationship:</Text> {funeralDetails?.relationship || "N/A"}</Text>
          <Text><Text bold>Phone:</Text> {funeralDetails?.phone || "N/A"}</Text>
          <Text><Text bold>Address:</Text> {funeralDetails?.address?.state || "N/A"}, {funeralDetails?.address?.country || "N/A"}, {funeralDetails?.address?.zip || "N/A"}</Text>
          <Text><Text bold>Place of Death:</Text> {funeralDetails?.placeOfDeath || "N/A"}</Text>
          <Text><Text bold>Funeral Date:</Text> {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</Text>
          <Text><Text bold>Time:</Text> {funeralDetails?.funeraltime || "N/A"}</Text>
          <Text><Text bold>Service Type:</Text> {funeralDetails?.serviceType || "N/A"}</Text>
          <Text><Text bold>Priest Visit:</Text> {funeralDetails?.priestVisit || "N/A"}</Text>
          <Text><Text bold>Reason of Death:</Text> {funeralDetails?.reasonOfDeath || "N/A"}</Text>
          <Text><Text bold>Funeral Mass Date:</Text> {funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}</Text>
          <Text><Text bold>Funeral Mass Time:</Text> {funeralDetails?.funeralMasstime || "N/A"}</Text>
          <Text><Text bold>Funeral Mass:</Text> {funeralDetails?.funeralMass || "N/A"}</Text>
          <Text><Text bold>Funeral Status:</Text> {funeralDetails?.funeralStatus || "N/A"}</Text>
          <Text><Text bold>Confirmed At:</Text> {funeralDetails?.confirmedAt ? new Date(funeralDetails.confirmedAt).toLocaleDateString() : "N/A"}</Text>
        </Box>

        {/* Death Certificate Section */}
        <Box bg="gray.100" p={4} borderRadius="lg">
          <Heading size="md" mb={2}>Death Certificate</Heading>
          <Divider />
          {funeralDetails?.deathCertificate?.url ? (
            <Center>
              <Image
                source={{ uri: funeralDetails.deathCertificate.url }}
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />
            </Center>
          ) : (
            <Text>No death certificate uploaded.</Text>
          )}
        </Box>

        {/* Admin Comments Section */}
        <Box bg="gray.100" p={4} borderRadius="lg">
          <Heading size="md" mb={2}>Admin Comments</Heading>
          <Divider />
          {funeralDetails?.comments?.length > 0 ? (
            funeralDetails.comments.map((comment, index) => (
              <Box key={index} p={2} bg="white" borderRadius="md" my={2}>
                <Text><Text bold>Date:</Text> {new Date(comment?.createdAt).toLocaleDateString()}</Text>
                <Text><Text bold>Comment:</Text> {comment?.selectedComment || "N/A"}</Text>
                <Text><Text bold>Additional Comment:</Text> {comment?.additionalComment || "N/A"}</Text>
              </Box>
            ))
          ) : (
            <Text>No admin comments.</Text>
          )}
        </Box>

        {/* Updated Funeral Date Section */}
        <Box bg="gray.100" p={4} borderRadius="lg">
          <Heading size="md" mb={2}>Updated Funeral Date</Heading>
          <Divider />
          <Text><Text bold>Date:</Text> {funeralDetails?.updatedFuneralDate ? new Date(funeralDetails.updatedFuneralDate).toLocaleDateString() : "N/A"}</Text>
          {funeralDetails?.adminRescheduled?.reason && (
            <Box mt={2} p={2} bg="white" borderRadius="md">
              <Heading size="sm">Reason for Rescheduling</Heading>
              <Text>{funeralDetails.adminRescheduled.reason}</Text>
            </Box>
          )}
        </Box>

        {/* Priest Section */}
        <Box bg="gray.100" p={4} borderRadius="lg">
          <Heading size="md" mb={2}>Assigned Priest</Heading>
          <Divider />
          <Text>{funeralDetails?.Priest?.name || "No priest assigned"}</Text>
        </Box>

        {/* Cancel Button */}
        <Center>
          <Button colorScheme="red" onPress={handleCancel}>Cancel Funeral Request</Button>
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default MySubmittedFuneralForm;
