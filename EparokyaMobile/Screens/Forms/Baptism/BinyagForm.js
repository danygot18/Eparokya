import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import baseURL from '../../../assets/common/baseUrl';

const BaptismForm = ({ navigation }) => {
  const [baptismDate, setBaptismDate] = useState(new Date());
  const [baptismTime, setBaptismTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [ninong, setNinong] = useState([]);
  const [ninang, setNinang] = useState([]);

  const [child, setChild] = useState({ fullName: '', dateOfBirth: new Date(), placeOfBirth: '', gender: '' });
  const [parents, setParents] = useState({ fatherFullName: '', placeOfFathersBirth: '', motherFullName: '', placeOfMothersBirth: '', address: '', marriageStatus: '' });
  const [NinongGodparents, setNinongGodparents] = useState([]);
  const [NinangGodparents, setNinangGodparents] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const [birthCertificate, setBirthCertificate] = useState(null);
  const [marriageCertificate, setMarriageCertificate] = useState(null);
  const [baptismPermit, setBaptismPermit] = useState(null);

  const { user, token } = useSelector(state => state.auth);

  // useEffect(() => {
  //   if (!token) {
  //     Alert.alert('Error', 'Token is missing. Please log in again.');
  //     navigation.navigate('LoginPage');
  //     return;
  //   }
  //   axios.get(`${baseURL}/profile`, { headers: { Authorization: `Bearer ${token}` } })
  //     .then(({ data }) => setUserId(data.user._id))
  //     .catch(() => {
  //       Alert.alert('Error', 'Unable to retrieve user data.');
  //       navigation.navigate('LoginPage');
  //     });
  // }, []);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!phone || !child.fullName || !child.dateOfBirth || !parents.fatherFullName || !parents.motherFullName || !birthCertificate || !marriageCertificate || !baptismPermit) {
      setError('Please fill in all the required fields.');
      return;
    }

    let formData = new FormData();
    formData.append('baptismDate', baptismDate.toISOString());
    formData.append('baptismTime', baptismTime.toISOString());
    formData.append('phone', phone);
    formData.append('child', JSON.stringify(child));
    formData.append('parents', JSON.stringify(parents));
    formData.append('ninong', JSON.stringify(ninong));
    formData.append('ninang', JSON.stringify(ninang));
    formData.append('NinongGodparents', JSON.stringify(NinongGodparents));
    formData.append('NinangGodparents', JSON.stringify(NinangGodparents));

    // Append images if they exist
    if (birthCertificate) {
      formData.append('birthCertificate', {
        uri: birthCertificate,
        name: 'birth_certificate.jpg',
        type: 'image/jpeg',
      });
    }

    if (marriageCertificate) {
      formData.append('marriageCertificate', {
        uri: marriageCertificate,
        name: 'marriage_certificate.jpg',
        type: 'image/jpeg',
      });
    }

    if (baptismPermit) {
      formData.append('baptismPermit', {
        uri: baptismPermit,
        name: 'baptism_permit.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await axios.post(`${baseURL}/baptismCreate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Baptism form submitted successfully.');
        navigation.navigate('Home');
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  const addGodparent = (type) => {
    if (type === 'ninong') {
      setNinongGodparents([...NinongGodparents, { name: '', address: '', religion: '' }]);
    } else {
      setNinangGodparents([...NinangGodparents, { name: '', address: '', religion: '' }]);
    }
  };

  const removeGodparent = (type, index) => {
    if (type === 'ninong') {
      setNinongGodparents(NinongGodparents.filter((_, i) => i !== index));
    } else {
      setNinangGodparents(NinangGodparents.filter((_, i) => i !== index));
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Baptism Form</Text>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <Text>Contact Number</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text>Buong Pangalang ng Bibinyagan</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={child.fullName} onChangeText={(text) => setChild({ ...child, fullName: text })} />

      <Text>Araw ng Binyag</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput editable={false} value={baptismDate.toDateString()} style={{ borderWidth: 1, padding: 10 }} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={baptismDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setBaptismDate(date);
          }}
        />
      )}

      <Text>Oras ng Binyag</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput editable={false} value={baptismTime.toLocaleTimeString()} style={{ borderWidth: 1, padding: 10 }} />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={baptismTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setBaptismTime(time);
          }}
        />
      )}

      <Text>Araw ng kapanganakan</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput editable={false} value={child.dateOfBirth.toDateString()} style={{ borderWidth: 1, padding: 10 }} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={child.dateOfBirth}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setChild({ ...child, dateOfBirth: date });
          }}
        />
      )}

      <Text>Lugar kung saan ipinanganak</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={child.placeOfBirth} onChangeText={(text) => setChild({ ...child, placeOfBirth: text })} />

      <Text>Kasarian</Text>
      <Picker selectedValue={child.gender} onValueChange={(itemValue) => setChild({ ...child, gender: itemValue })}>
        <Picker.Item label="Pumili ng kasarian" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Pangalan ng Ama</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={parents.fatherFullName} onChangeText={(text) => setParents({ ...parents, fatherFullName: text })} />

      <Text>Lugar ng kapanganakan</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={parents.placeOfFathersBirth} onChangeText={(text) => setParents({ ...parents, placeOfFathersBirth: text })} />

      <Text>Pangalan ng Ina (noong dalaga pa)</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={parents.motherFullName} onChangeText={(text) => setParents({ ...parents, motherFullName: text })} />

      <Text>Lugar ng kapanganakan</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={parents.placeOfMothersBirth} onChangeText={(text) => setParents({ ...parents, placeOfMothersBirth: text })} />

      <Text>Tirahan</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={parents.address} onChangeText={(text) => setParents({ ...parents, address: text })} />

      <Text>Saan Kasal</Text>
      <Picker selectedValue={parents.marriageStatus} onValueChange={(itemValue) => setParents({ ...parents, marriageStatus: itemValue })}>
        <Picker.Item label="Select Marriage Status" value="" />
        <Picker.Item label="Simbahan" value="Simbahan" />
        <Picker.Item label="Civil" value="Civil" />
        <Picker.Item label="Nat" value="Nat" />
      </Picker>

      <Text>Ninong Full Name</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninong.name} onChangeText={(text) => setNinong({ ...ninong, name: text })} />

      <Text>Ninong Address</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninong.address} onChangeText={(text) => setNinong({ ...ninong, address: text })} />

      <Text>Ninong Religion</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninong.religion} onChangeText={(text) => setNinong({ ...ninong, religion: text })} />

      <Text>Ninang Full Name</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninang.name} onChangeText={(text) => setNinang({ ...ninang, name: text })} />

      <Text>Ninang Address</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninang.address} onChangeText={(text) => setNinang({ ...ninang, address: text })} />

      <Text>Ninang Religion</Text>
      <TextInput style={{ borderWidth: 1, padding: 10 }} value={ninang.religion} onChangeText={(text) => setNinang({ ...ninang, religion: text })} />

      <Text>Ninong</Text>
      {NinongGodparents.map((godparent, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={{ borderWidth: 1, padding: 10, flex: 1 }} value={godparent.name} onChangeText={(text) => {
            let updated = [...NinongGodparents];
            updated[index].name = text;
            setNinongGodparents(updated);
          }} />
          {/* <Button title="Remove" onPress={() => removeGodparent('ninong', index)} /> */}
          <TouchableOpacity onPress={() => removeGodparent('ninong')} style={{ backgroundColor: '#26572E', borderRadius: 8, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={() => addGodparent('ninong')} style={{ backgroundColor: '#26572E', borderRadius: 8, padding: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD NINONG</Text>
      </TouchableOpacity>

      <Text>Ninang</Text>
      {NinangGodparents.map((godparent, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={{ borderWidth: 1, padding: 10, flex: 1 }} value={godparent.name} onChangeText={(text) => {
            let updated = [...NinangGodparents];
            updated[index].name = text;
            setNinangGodparents(updated);
          }} />
          {/* <Button title="Remove" onPress={() => removeGodparent('ninang', index)} /> */}
          <TouchableOpacity onPress={() => removeGodparent('ninang')} style={{ backgroundColor: '#26572E', borderRadius: 8, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Remove</Text>
          </TouchableOpacity>

        </View>
      ))}
      <TouchableOpacity onPress={() => addGodparent('ninang')} style={{ backgroundColor: '#26572E', borderRadius: 8, padding: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD NINANG</Text>
      </TouchableOpacity>

      {/* Image Pickers */}
      <Text>Birth Certificate</Text>
      <TouchableOpacity onPress={() => pickImage(setBirthCertificate)}>
        <View style={{ borderWidth: 1, padding: 10, alignItems: 'center' }}>
          {birthCertificate ? <Image source={{ uri: birthCertificate }} style={{ width: 100, height: 100 }} /> : <Text>Pick an image</Text>}
        </View>
      </TouchableOpacity>

      <Text>Marriage Certificate</Text>
      <TouchableOpacity onPress={() => pickImage(setMarriageCertificate)}>
        <View style={{ borderWidth: 1, padding: 10, alignItems: 'center' }}>
          {marriageCertificate ? <Image source={{ uri: marriageCertificate }} style={{ width: 100, height: 100 }} /> : <Text>Pick an image</Text>}
        </View>
      </TouchableOpacity>

      <Text>Baptism Permit</Text>
      <TouchableOpacity onPress={() => pickImage(setBaptismPermit)}>
        <View style={{ borderWidth: 1, padding: 10, alignItems: 'center' }}>
          {baptismPermit ? <Image source={{ uri: baptismPermit }} style={{ width: 100, height: 100 }} /> : <Text>Pick an image</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#26572E', borderRadius: 8, padding: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 25,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#26572E',
    padding: 15,
    borderRadius: 25,
    width: 250,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#B3CF99',
    padding: 15,
    borderRadius: 25,
    width: 250,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  submitButton: {
    backgroundColor: '#26572E',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#26572E',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  }
});

export default BaptismForm;