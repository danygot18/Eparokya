import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

const WeddingForm = ({ navigation }) => {
  const [dateOfApplication, setDateOfApplication] = useState(new Date());
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [weddingTime, setWeddingTime] = useState(new Date());
  const [showDateOfApplicationPicker, setShowDateOfApplicationPicker] = useState(false);
  const [showWeddingDatePicker, setShowWeddingDatePicker] = useState(false);
  const [showWeddingTimePicker, setShowWeddingTimePicker] = useState(false);
  const formattedWeddingTime = weddingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [error, setError] = useState('');

  const { user, token } = useSelector(state => state.auth);

  const onDateChange = (setter, setShowPicker) => (event, selectedDate) => {
    setShowPicker(false); 
    if (selectedDate) {
      setter(selectedDate);
    }
  };

  const goToNextPage = () => {
    if (!dateOfApplication || !weddingDate || !weddingTime) {
      setError('Please fill in all fields.');
      return;
    }

    navigation.navigate('WeddingForm2', {
      dateOfApplication: dateOfApplication.toISOString(),
      weddingDate: weddingDate.toISOString(),
      weddingTime: formattedWeddingTime,
    });
  };
  

  const clearFields = () => {
    setDateOfApplication(new Date());
    setWeddingDate(new Date());
    setWeddingTime(new Date());
    setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowDateOfApplicationPicker(true)}>
          <Text style={styles.buttonText}>Select Date of Application</Text>
        </TouchableOpacity>
        {showDateOfApplicationPicker && (
          <DateTimePicker
            value={dateOfApplication}
            mode="date"
            display="default"
            onChange={onDateChange(setDateOfApplication, setShowDateOfApplicationPicker)}
          />
        )}
        <Text style={styles.selectedDate}>{dateOfApplication.toDateString()}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowWeddingDatePicker(true)}>
          <Text style={styles.buttonText}>Select Wedding Date</Text>
        </TouchableOpacity>
        {showWeddingDatePicker && (
          <DateTimePicker
            value={weddingDate}
            mode="date"
            display="default"
            onChange={onDateChange(setWeddingDate, setShowWeddingDatePicker)}
          />
        )}
        <Text style={styles.selectedDate}>{weddingDate.toDateString()}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowWeddingTimePicker(true)}>
          <Text style={styles.buttonText}>Select Wedding Time</Text>
        </TouchableOpacity>
        {showWeddingTimePicker && (
          <DateTimePicker
            value={weddingTime}
            mode="time"
            display="default"
            onChange={onDateChange(setWeddingTime, setShowWeddingTimePicker)}
          />
        )}
        <Text style={styles.selectedDate}>{formattedWeddingTime}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.nextButton} onPress={goToNextPage}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
        <Text style={styles.clearButtonText}>Clear Fields</Text>
      </TouchableOpacity>
    </View>
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
});

export default WeddingForm;
