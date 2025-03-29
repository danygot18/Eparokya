import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import baseURL from '../../assets/common/baseUrl';

const UserLive = () => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveVideo = async () => {
      try {
        const response = await axios.get(`${baseURL}/live`);
        setLiveData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching live video", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveVideo();
  }, []);

  const handleOpenFacebook = () => {
    if (liveData?.url) {
      Linking.openURL(liveData.url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* MetaData component would need to be adapted for React Native */}
      {/* You might use a Head component from a library like react-native-head */}

      {/* Sidebar - You'll need to adapt GuestSideBar for React Native */}

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Live Mass</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : liveData ? (
          <View style={styles.videoContainer}>
            <Text style={styles.description}>{liveData.description}</Text>
            
            <View style={styles.videoWrapper}>
              <WebView
                source={{ uri: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveData.url)}&show_text=false` }}
                style={styles.video}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
                scrollEnabled={false}
              />
            </View>

            <Text style={styles.linkText}>
              For better experience, watch on Facebook:
            </Text>
            <TouchableOpacity onPress={handleOpenFacebook}>
              <Text style={styles.link}>{liveData.url}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noVideoText}>No live video available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16/9,
    marginTop: 10,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  linkText: {
    marginTop: 20,
    padding: 10,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  noVideoText: {
    color: 'gray',
  },
});

export default UserLive;