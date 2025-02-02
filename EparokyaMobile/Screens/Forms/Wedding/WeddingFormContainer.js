import React, { useState } from 'react';
import { View, Text } from 'react-native';
import WeddingForm from './WeddingForm';
import WeddingForm2 from './WeddingForm2';
import WeddingForm3 from './WeddingForm3';

const WeddingFormContainer = ({ navigation }) => {
  const [brideData, setBrideData] = useState({});
  const [groomData, setGroomData] = useState({});

  const handleBrideData = (data) => setBrideData(data);
  const handleGroomData = (data) => setGroomData(data);

  return (
    <View>
      <WeddingForm onSubmit={handleBrideData} navigation={navigation} />
      <WeddingForm2 onSubmit={handleGroomData} navigation={navigation} />
      <WeddingForm3 brideData={brideData} groomData={groomData} navigation={navigation} />
    </View>
  );
};

export default WeddingFormContainer;
