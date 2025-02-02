import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const ConfirmedFuneral = ({ navigation }) => {
  const [confirmedFunerals, setConfirmedFunerals] = useState([]);
  const [error, setError] = useState('');
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchConfirmedFunerals = async () => {
      try {
        
        if (!token) {
          Alert.alert('Error', 'Token is missing. Please log in again.');
          navigation.navigate('LoginPage');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/funeral/`, config);
        const confirmed = response.data.filter((funeral) => funeral.funeralStatus === 'Confirmed');
        setConfirmedFunerals(confirmed);
      } catch (err) {
        console.error('Error fetching confirmed funerals:', err.response ? err.response.data : err.message);
        setError('Unable to fetch confirmed funerals. Please try again later.');
      }
    };

    fetchConfirmedFunerals();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ConfirmedFuneralDetails', { funeralId: item._id })}
    >
      <Text style={styles.name}>
        {item.name.firstName} {item.name.middleName} {item.name.lastName} {item.name.suffix || ''}
      </Text>
      <Text>Gender: {item.gender}</Text>
      <Text>Age: {item.age}</Text>
      <Text>Funeral Date: {new Date(item.funeralDate).toLocaleDateString()}</Text>
      <Text>Service Type: {item.serviceType}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmed Funerals</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {confirmedFunerals.length > 0 ? (
        <FlatList
          data={confirmedFunerals}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>No confirmed funeral records found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default ConfirmedFuneral;
