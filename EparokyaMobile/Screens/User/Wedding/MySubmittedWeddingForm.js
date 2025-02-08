import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import baseURL from "../../../assets/common/baseUrl";
import { useSelector } from "react-redux";


const MySubmittedWeddingForm = ({ route }) => {
  const { formId } = route.params;
  const navigation = useNavigation();
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/getWeddingForm/${formId}`);
        setFormDetails(response.data);
      } catch (error) {
        console.error('Error fetching form details:', error);
        Alert.alert('Error', 'Failed to load form details.');
      } finally {
        setLoading(false);
      }
    };
    fetchFormDetails();
  }, []);

  const handleCancelApplication = async () => {
    try {
      await axios.put(`${baseURL}/${formId}/cancelWedding`);
      Toast.show({ type: 'success', text1: 'Application Cancelled' });
      navigation.goBack();
    } catch (error) {
      console.error('Error cancelling application:', error);
      Alert.alert('Error', 'Failed to cancel application.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Wedding Form Details</Text>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bride:</Text>
        <Text>{formDetails.brideName}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Groom:</Text>
        <Text>{formDetails.groomName}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Wedding Date:</Text>
        <Text>{formDetails.weddingDate}</Text>
      </View>

      {formDetails.images?.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={{ width: '100%', height: 200, marginBottom: 10 }} />
      ))}

      {formDetails.adminComment && (
        <View style={{ backgroundColor: '#f8d7da', padding: 10, borderRadius: 5, marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', color: '#721c24' }}>Admin Comment:</Text>
          <Text>{formDetails.adminComment}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel Application</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Cancellation</Text>
            <Text>Are you sure you want to cancel your wedding application?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                onPress={handleCancelApplication}
                style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginRight: 10 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MySubmittedWeddingForm;
