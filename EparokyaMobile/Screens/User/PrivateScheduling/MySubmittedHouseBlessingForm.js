import baseURL from '../../../assets/common/baseUrl';
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

const MySubmittedHouseBlessingForm = () => {
    const route = useRoute();
    const { formId } = route.params;
    const [blessingDetails, setBlessingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchBlessingDetails = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/getHouseBlessingForm/${formId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBlessingDetails(response.data);
            } catch (err) {
                setError("Failed to fetch house blessing details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlessingDetails();
    }, [formId]);

    const handleCancel = async () => {
        try {
            Alert.alert(
                "Cancel Request",
                "Are you sure you want to cancel this house blessing request?",
                [
                    {
                        text: "No",
                        style: "cancel"
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            try {
                                const response = await axios.put(
                                    `${baseURL}/cancelHouseBlessing/${formId}`,
                                    {},
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );

                                if (response.data.success) {
                                    Alert.alert("Success", "House blessing request cancelled successfully!");
                                    navigation.navigate("UserProfile");
                                }
                            } catch (err) {
                                Alert.alert("Error", err.response?.data?.message || "Error cancelling the house blessing request.");
                            }
                        }
                    }
                ]
            );
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Error cancelling the house blessing request.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return ( 
        
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>House Blessing Details</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Full Name:</Text> {blessingDetails?.fullName || "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Contact Number:</Text> {blessingDetails?.contactNumber || "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Address:</Text> {blessingDetails?.address?.houseDetails || "N/A"},
                        {blessingDetails?.address?.phase || "N/A"},
                        {blessingDetails?.address?.street || "N/A"},
                        {blessingDetails?.address?.baranggay || "N/A"},
                        {blessingDetails?.address?.district || "N/A"},
                        {blessingDetails?.address?.city || "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Blessing Date:</Text> {blessingDetails?.blessingDate ? new Date(blessingDetails.blessingDate).toLocaleDateString() : "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Blessing Time:</Text> {blessingDetails?.blessingTime || "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Blessing Status:</Text> {blessingDetails?.blessingStatus || "N/A"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Confirmed At:</Text> {blessingDetails?.confirmedAt ? new Date(blessingDetails.confirmedAt).toLocaleDateString() : "N/A"}</Text>
                </View>
        
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Admin Comments</Text>
                    {blessingDetails?.comments && blessingDetails.comments.length > 0 ? (
                        blessingDetails.comments.map((comment, index) => (
                            <View key={index} style={{ marginBottom: 8 }}>
                                <Text><Text style={{ fontWeight: "bold" }}>Selected Comment:</Text> {comment?.selectedComment || "N/A"}</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Additional Comment:</Text> {comment?.additionalComment || "N/A"}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No admin comments yet.</Text>
                    )}
                </View>
        
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Updated Blessing Date</Text>
                    <Text>{blessingDetails?.adminRescheduled?.date ? new Date(blessingDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}</Text>
                    {blessingDetails?.adminRescheduled?.reason && (
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Reason for Rescheduling</Text>
                            <Text>{blessingDetails.adminRescheduled.reason}</Text>
                        </View>
                    )}
                </View>
        
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Priest</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Priest:</Text> {blessingDetails?.priest || "N/A"}</Text>
                </View>
        
                {blessingDetails?.blessingStatus === "Pending" && (
                    <View style={{ marginTop: 16 }}>
                        <Button title="Cancel Request" onPress={handleCancel} color="red" />
                    </View>
                )}
            </ScrollView>
        );
};

export default MySubmittedHouseBlessingForm;