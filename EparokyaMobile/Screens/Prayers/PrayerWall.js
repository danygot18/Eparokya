import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import baseURL from '../../assets/common/baseUrl';

const PrayerWall = ({ navigation }) => {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    prayerRequest: '',
    prayerWallSharing: 'anonymous',
    contact: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const prayersPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [loadingPrayerId, setLoadingPrayerId] = useState(null);

  const { user, token } = useSelector(state => state.auth);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       try {
  //         const response = await axios.get(`${baseURL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
  //         setUser(response.data.user);
  //       } catch (error) {
  //         console.error('Error fetching user:', error.response ? error.response.data : error.message);
  //       }
  //     };
  //     fetchUser();
  //   }, []);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/prayer-wall?page=${currentPage}&limit=${prayersPerPage}`, { headers: { Authorization: `Bearer ${token}` } });
        const { prayers, total } = response.data;
        setPrayers(prayers);
        setTotalPrayers(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayers:', error);
        setLoading(false);
      }
    };
    fetchPrayers();
  }, [currentPage]);

  const handleNewPrayerSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post a prayer.');
      return;
    }

    try {
      const prayerData = { ...newPrayer, userId: user._id };
      await axios.post(`${baseURL}/submitPrayer`, prayerData, { headers: { Authorization: `Bearer ${token}` } });
      setNewPrayer({ title: '', prayerRequest: '', prayerWallSharing: 'anonymous', contact: '' });
      Alert.alert('Success', 'Successful! Please wait for the admin confirmation for your prayer to be posted');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error posting prayer:', error);
      Alert.alert('Error', 'Failed to post prayer. Please try again.');
    }
  };

  const handleLike = async (prayerId) => {
    try {
      const response = await axios.put(`${baseURL}/toggleLike/${prayerId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
              ...prayer,
              likes: response.data.likes,
              likedByUser: response.data.likedByUser,
            }
            : prayer
        )
      );
    } catch (error) {
      console.error('Error liking prayer:', error);
    }
  };

  const handleInclude = async (prayerId) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to include a prayer.');
      return;
    }

    try {
      setLoadingPrayerId(prayerId);
      const response = await axios.put(`${baseURL}/toggleInclude/${prayerId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPrayers((prevPrayers) =>
        prevPrayers.map((prayer) =>
          prayer._id === prayerId
            ? {
              ...prayer,
              includeCount: response.data.includeCount,
              includedByUser: response.data.includedByUser,
            }
            : prayer
        )
      );
    } catch (error) {
      console.error('Error including prayer:', error);
    } finally {
      setLoadingPrayerId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.prayerShare}>
        <Button title="Click here to Share a Prayer" onPress={() => setIsModalOpen(true)} color="#154314" />
      </View>

      {isModalOpen && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Share a Prayer</Text>
          <TextInput
            placeholder="Title"
            value={newPrayer.title}
            onChangeText={(text) => setNewPrayer({ ...newPrayer, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Your prayer request"
            value={newPrayer.prayerRequest}
            onChangeText={(text) => setNewPrayer({ ...newPrayer, prayerRequest: text })}
            style={styles.textArea}
            multiline
          />
          <TextInput
            placeholder="Contact"
            value={newPrayer.contact}
            onChangeText={(text) => setNewPrayer({ ...newPrayer, contact: text })}
            style={styles.input}
          />
          <View style={styles.radioGroup}>
            <TouchableOpacity onPress={() => setNewPrayer({ ...newPrayer, prayerWallSharing: 'anonymous' })}>
              <Text style={styles.radioLabel}>
                <Text style={newPrayer.prayerWallSharing === 'anonymous' ? styles.radioSelected : styles.radioUnselected}>●</Text> Share anonymously
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewPrayer({ ...newPrayer, prayerWallSharing: 'myName' })}>
              <Text style={styles.radioLabel}>
                <Text style={newPrayer.prayerWallSharing === 'myName' ? styles.radioSelected : styles.radioUnselected}>●</Text> Share with my name
              </Text>
            </TouchableOpacity>
          </View>
          <Button title="Post Prayer" onPress={handleNewPrayerSubmit} />
          <Button title="Close" onPress={() => setIsModalOpen(false)} color="red" />
        </View>
      )}

      {loading ? (
        <Text>Loading prayers...</Text>
      ) : (
        prayers.map((prayer) => (
          <View key={prayer._id} style={styles.prayerBox}>
            <View style={styles.prayerHeader}>
              <Image
                source={{
                  uri: prayer.prayerWallSharing === 'anonymous'
                    ? '../../assets/EPAROKYA-SYST.png'
                    : prayer.user?.avatar?.url || '../../assets/EPAROKYA-SYST.png',
                }}
                style={styles.avatar}
              />
              <Text style={styles.prayerUser}>
                {prayer.prayerWallSharing === 'anonymous' ? 'Anonymous' : prayer.user?.name || 'Unknown User'}
              </Text>
            </View>
            <Text style={styles.prayerTitle}>{prayer.title}</Text>
            <Text style={styles.prayerDescription}>{prayer.prayerRequest}</Text>
            <View style={styles.prayerActions}>
              <TouchableOpacity onPress={() => handleLike(prayer._id)} style={styles.likeButton}>
                {prayer.likedByUser ? (
                  <FontAwesome name="heart" size={24} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={24} color="black" />
                )}
                <Text style={styles.likeCount}>{prayer.likes || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleInclude(prayer._id)}
                disabled={prayer.includedByUser || loadingPrayerId === prayer._id}
                style={styles.includeButton}
              >
                <Text style={styles.includeText}>
                  {prayer.includedByUser
                    ? 'You have included this in your prayer'
                    : loadingPrayerId === prayer._id
                      ? 'Processing...'
                      : `Include (${prayer.includeCount || 0})`}
                </Text>
              </TouchableOpacity>

              {prayer.includedByUser && (
                <View style={styles.includedIndicator}>
                  <Text style={styles.includedText}>
                    
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.prayerMeta}>
              <Text>Created: {new Date(prayer.createdAt).toLocaleDateString()}</Text>
              {prayer.confirmedAt && <Text>Confirmed: {new Date(prayer.confirmedAt).toLocaleDateString()}</Text>}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  prayerShare: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  textArea: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
    height: 100,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
  radioSelected: {
    color: 'blue',
  },
  radioUnselected: {
    color: 'gray',
  },
  prayerBox: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  prayerUser: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  prayerDescription: {
    fontSize: 14,
    marginTop: 10,
  },
  prayerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  icon: {
    fontSize: 24,
  },
  likeCount: {
    fontSize: 18,
  },
  includeButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  includeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  includedIndicator: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    textAlign: 'center',
  },
  includedText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  prayerMeta: {
    flexDirection: 'column',
    gap: 5,
    marginTop: 10,
  },
});

export default PrayerWall;