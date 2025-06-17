import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import baseURL from "../assets/common/baseUrl";

const WeddingWall = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeddings = async () => {
    try {
      setError(null);
      const response = await fetch(`${baseURL}/confirmedWedding`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weddings');
      }
      
      const data = await response.json();
      setWeddings(data);
    } catch (error) {
      console.error("Error fetching weddings:", error);
      setError("Failed to load weddings. Please pull down to refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeddings();
  };

  const handleWeddingPress = (wedding) => {
    Alert.alert(
      `${wedding.groomName} & ${wedding.brideName}`,
      `Wedding Date: ${formatDate(wedding.weddingDate)}\nTime: ${formatTime(wedding.weddingTime)}`,
      [{ text: "OK" }]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2e7d32']}
        />
      }
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weddings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming weddings scheduled</Text>
        </View>
      ) : (
        weddings.map((wedding, index) => (
          <WeddingCard 
            key={index}
            wedding={wedding}
            onPress={handleWeddingPress}
          />
        ))
      )}
    </ScrollView>
  );
};

const WeddingCard = ({ wedding, onPress }) => {
  const groomImageUrl = wedding.GroomOneByOne?.url || 'https://via.placeholder.com/150';
  const brideImageUrl = wedding.BrideOneByOne?.url || 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(wedding)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.churchName}>Saint Joseph Parish - Taguig</Text>
      </View>

      <View style={styles.coupleContainer}>
        <View style={styles.personContainer}>
          <Image
            source={{ uri: groomImageUrl }}
            style={styles.personImage}
          />
          <Text style={styles.personName}>{wedding.groomName}</Text>
        </View>

        <Text style={styles.andSymbol}>&</Text>

        <View style={styles.personContainer}>
          <Image
            source={{ uri: brideImageUrl }}
            style={styles.personImage}
          />
          <Text style={styles.personName}>{wedding.brideName}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wedding Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(wedding.weddingDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wedding Time:</Text>
          <Text style={styles.detailValue}>
            {new Date(`1970-01-01T${wedding.weddingTime}`).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Confirmed On:</Text>
          <Text style={styles.detailValue}>
            {new Date(wedding.confirmedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          Kung may tutol man po sa mga ikakasal, maari lamang na
          makipag-ugnayan sa parokya o sa ating opisina. Maraming
          Salamat po.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 16,
  },
  churchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  coupleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  personContainer: {
    alignItems: 'center',
    flex: 1,
  },
  personImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#81c784',
    marginBottom: 8,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  andSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff8f00',
    marginHorizontal: 10,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default WeddingWall;