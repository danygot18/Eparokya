import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WeddingForm = ({ navigation }) => {
  const [dateOfApplication, setDateOfApplication] = useState(new Date());
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [weddingTime, setWeddingTime] = useState(new Date());
  const [showDateOfApplicationPicker, setShowDateOfApplicationPicker] = useState(false);
  const [showWeddingDatePicker, setShowWeddingDatePicker] = useState(false);
  const [showWeddingTimePicker, setShowWeddingTimePicker] = useState(false);
  const [error, setError] = useState('');

  const onDateOfApplicationChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfApplication;
    setShowDateOfApplicationPicker(Platform.OS === 'ios');
    setDateOfApplication(currentDate);
  };

  const onWeddingDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || weddingDate;
    setShowWeddingDatePicker(Platform.OS === 'ios');
    setWeddingDate(currentDate);
  };

  const onWeddingTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || weddingTime;
    setShowWeddingTimePicker(Platform.OS === 'ios');
    setWeddingTime(currentTime);
  };

  const goToNextPage = () => {
    if (!dateOfApplication || !weddingDate || !weddingTime) {
      setError('Please fill in all fields.');
      return;
    }

    navigation.navigate('WeddingForm2', {
      dateOfApplication: dateOfApplication.toISOString(),
      weddingDate: weddingDate.toISOString(),
      weddingTime: weddingTime.toISOString(),
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
      <View>
        <Button onPress={() => setShowDateOfApplicationPicker(true)} title="Select Date of Application" />
        {showDateOfApplicationPicker && (
          <DateTimePicker
            value={dateOfApplication}
            mode="date"
            display="default"
            onChange={onDateOfApplicationChange}
          />
        )}
        <Text>{dateOfApplication.toDateString()}</Text>
      </View>

      <View>
        <Button onPress={() => setShowWeddingDatePicker(true)} title="Select Wedding Date" />
        {showWeddingDatePicker && (
          <DateTimePicker
            value={weddingDate}
            mode="date"
            display="default"
            onChange={onWeddingDateChange}
          />
        )}
        <Text>{weddingDate.toDateString()}</Text>
      </View>

      <View>
        <Button onPress={() => setShowWeddingTimePicker(true)} title="Select Wedding Time" />
        {showWeddingTimePicker && (
          <DateTimePicker
            value={weddingTime}
            mode="time"
            display="default"
            onChange={onWeddingTimeChange}
          />
        )}
        <Text>{weddingTime.toLocaleTimeString()}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Next" onPress={goToNextPage} />
      <Button title="Clear Fields" onPress={clearFields} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' },
  error: { color: 'red', marginBottom: 10 },
});

export default WeddingForm;