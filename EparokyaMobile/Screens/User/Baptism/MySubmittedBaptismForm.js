import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Alert, TouchableOpacity, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Button, VStack, HStack, Heading, Spinner, Box } from "native-base";
import axios from "axios";
import baseURL from '../../../assets/common/baseUrl';

const MySubmittedBaptismForm = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { formId } = route.params;
    const [baptismDetails, setBaptismDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [comments, setComments] = useState([]);


    useEffect(() => {
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
        fetchBaptismDetails();
    }, [formId]);

    const handleCancel = async () => {
        try {
            await axios.put(`${baseURL}/declineBaptism/${formId}`);
            Alert.alert("Success", "Baptism request cancelled.", [{ text: "OK", onPress: () => navigation.navigate("Dashboard") }]);
        } catch (error) {
            Alert.alert("Error", "Failed to cancel the baptism request.");
        }
    };

    if (loading) return <Spinner size="lg" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ScrollView padding={5}>
            <Heading textAlign="center" mb={5}>My Submitted Baptism Form</Heading>
            <VStack space={4}>
                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">User Information</Heading>
                    <Text>User: {baptismDetails?.userId?.name || "N/A"}</Text>
                    <Text>Contact Number: {baptismDetails?.phone || "N/A"}</Text>
                </Box>
                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Baptism Information</Heading>
                    <Text>Baptism Date: {baptismDetails?.baptismDate || "N/A"}</Text>
                    <Text>Baptism Time: {baptismDetails?.baptismTime || "N/A"}</Text>
                </Box>
                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Child Information</Heading>
                    <Text>Child Name: {baptismDetails?.child?.fullName || "N/A"}</Text>
                    <Text>Birthdate: {baptismDetails?.child?.dateOfBirth || "N/A"}</Text>
                    <Text>Place of Birth: {baptismDetails?.child?.placeOfBirth || "N/A"}</Text>
                    <Text>Sex: {baptismDetails?.child?.gender || "N/A"}</Text>
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Parents Information</Heading>
                    <Text>Father: {baptismDetails?.parents?.fatherFullName || "N/A"}</Text>
                    <Text>Place of Birth: {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}</Text>

                    <Text>Mother: {baptismDetails?.parents?.motherFullName || "N/A"}</Text>
                    <Text>Place of Birth: {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}</Text>

                    <Text>Address: {baptismDetails?.parents?.address || "N/A"}</Text>
                    <Text>Marriage Status: {baptismDetails?.parents?.marriageStatus || "N/A"}</Text>
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Ninong</Heading>
                    <Text>Ninong: {baptismDetails?.ninong?.name || "N/A"}</Text>
                    <Text>Address: {baptismDetails?.ninong?.address || "N/A"}</Text>
                    <Text>Religion: {baptismDetails?.ninong?.religion || "N/A"}</Text>
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Ninang</Heading>
                    <Text>Ninang: {baptismDetails?.ninang?.name || "N/A"}</Text>
                    <Text>Address: {baptismDetails?.ninang?.address || "N/A"}</Text>
                    <Text>Religion: {baptismDetails?.ninang?.religion || "N/A"}</Text>
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Birth Certificate</Heading>
                    {baptismDetails?.Docs?.birthCertificate?.url ? (
                        <TouchableOpacity onPress={() => { setSelectedImage(baptismDetails.Docs.birthCertificate.url); setModalVisible(true); }}>
                            <Image source={{ uri: baptismDetails.Docs.birthCertificate.url }} style={{ width: 100, height: 100, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    ) : (<Text>N/A</Text>)}
                </Box>
                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Marriage Certificate</Heading>
                    {baptismDetails?.Docs?.marriageCertificate?.url ? (
                        <TouchableOpacity onPress={() => { setSelectedImage(baptismDetails.Docs.marriageCertificate.url); setModalVisible(true); }}>
                            <Image source={{ uri: baptismDetails.Docs.marriageCertificate.url }} style={{ width: 100, height: 100, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    ) : (<Text>N/A</Text>)}
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Baptismal Permit</Heading>
                    {baptismDetails?.additionalDocs?.baptismPermit?.url ? (
                        <TouchableOpacity onPress={() => { setSelectedImage(baptismDetails.Docs.baptismPermit.url); setModalVisible(true); }}>
                            <Image source={{ uri: baptismDetails.additionalDocs.baptismPermit.url }} style={{ width: 100, height: 100, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    ) : (<Text>N/A</Text>)}

                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Baptismal Permit</Heading>
                    {baptismDetails?.additionalDocs?.certificateOfNoRecordBaptism?.url ? (
                        <TouchableOpacity onPress={() => { setSelectedImage(baptismDetails.Docs.certificateOfNoRecordBaptism.url); setModalVisible(true); }}>
                            <Image source={{ uri: baptismDetails.additionalDocs.certificateOfNoRecordBaptism.url }} style={{ width: 100, height: 100, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    ) : (<Text>N/A</Text>)}

                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Additional Comment</Heading>
                    <Text><Text bold>Priest:</Text> {baptismDetails?.adminNotes?.priest || "No priest."}</Text>
                    <Text><Text bold>Recorded By:</Text> {baptismDetails?.adminNotes?.recordedBy || "No record."}</Text>
                    <Text><Text bold>Book Number:</Text> {baptismDetails?.adminNotes?.bookNumber || "No book number."}</Text>
                    <Text><Text bold>Page Number:</Text> {baptismDetails?.adminNotes?.pageNumber || "No page number."}</Text>
                    <Text><Text bold>Line Number:</Text> {baptismDetails?.adminNotes?.lineNumber || "No line number."}</Text>
                </Box>


                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Additional Notes</Heading>
                    <Text><Text bold>Priest:</Text> {baptismDetails?.adminNotes?.priest || "No priest."}</Text>
                    <Text><Text bold>Recorded By:</Text> {baptismDetails?.adminNotes?.recordedBy || "No record."}</Text>
                    <Text><Text bold>Book Number:</Text> {baptismDetails?.adminNotes?.bookNumber || "No book number."}</Text>
                    <Text><Text bold>Page Number:</Text> {baptismDetails?.adminNotes?.pageNumber || "No page number."}</Text>
                    <Text><Text bold>Line Number:</Text> {baptismDetails?.adminNotes?.lineNumber || "No line number."}</Text>
                </Box>
                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Updated Baptism Date</Heading>
                    <Text>{baptismDetails?.adminRescheduled ? new Date(baptismDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}</Text>
                    {baptismDetails?.adminRescheduled?.reason && (
                        <Box mt={2}>
                            <Heading size="sm">Reason for Rescheduling</Heading>
                            <Text>{baptismDetails.adminRescheduled.reason}</Text>
                        </Box>
                    )}
                </Box>

                <Box p={4} borderWidth={1} borderRadius={8}>
                    <Heading size="md">Admin Comments</Heading>
                    {comments && Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Box key={index} p={3} borderBottomWidth={1} borderColor="gray.300">
                                <Text bold>Comment Date: </Text>
                                <Text>{new Date(comment?.createdAt).toLocaleDateString()}</Text>
                                <Text bold>Comment:</Text>
                                <Text>{comment?.selectedComment || "N/A"}</Text>
                                <Text bold>Additional Comment:</Text>
                                <Text>{comment?.additionalComment || "N/A"}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text>No admin comments yet.</Text>
                    )}
                </Box>


                <Button colorScheme="danger" onPress={handleCancel}>Cancel Baptism Request</Button>
                {/* <UserBaptismChecklist baptismId={baptismDetails?._id} /> */}
            </VStack>

            <Modal visible={modalVisible} transparent={true}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" }}>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 300, height: 300 }} />}
                    <Button onPress={() => setModalVisible(false)} mt={4}>Close</Button>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default MySubmittedBaptismForm;
