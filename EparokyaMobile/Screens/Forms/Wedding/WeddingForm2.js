import React, { useState } from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Input,
  Label,
  Button,
  Text,
  YStack,
  ScrollView,
  Select,
  Tooltip,
} from "tamagui";
import { Picker } from '@react-native-picker/picker';




const barangayOptions = [
  "Bagumbayan",
  "Bambang",
  "Calzada",
  "Cembo",
  "Central Bicutan",
  "Central Signal Village",
  "Comembo",
  "East Rembo",
  "Fort Bonifacio",
  "Hagonoy",
  "Ibayo-Tipas",
  "Katuparan",
  "Ligid-Tipas",
  "Lower Bicutan",
  "Maharlika Village",
  "Napindan",
  "New Lower Bicutan",
  "North Daang Hari",
  "North Signal Village",
  "Palingon",
  "Pembo",
  "Pinagsama",
  "Pitogo",
  "Post Proper Northside",
  "Post Proper Southside",
  "Rizal",
  "San Miguel",
  "Santa Ana",
  "South Cembo",
  "South Daang Hari",
  "South Signal Village",
  "Tanyag",
  "Tuktukan",
  "Upper Bicutan",
  "Ususan",
  "Wawa",
  "West Rembo",
  "Western Bicutan",
  "Others",
];

const cityOptions = ["Taguig City", "Others"];

const WeddingForm2 = ({ navigation, route }) => {
  const [groomName, setGroomName] = useState("");
  const [groomPhone, setGroomPhone] = useState("");
  const [groomBirthDate, setGroomBirthDate] = useState(new Date());
  const [groomOccupation, setGroomOccupation] = useState("");
  const [groomReligion, setGroomReligion] = useState("");
  const [groomFather, setGroomFather] = useState("");
  const [groomMother, setGroomMother] = useState("");

  const [address, setAddress] = useState({
    BldgNameTower: "",
    LotBlockPhaseHouseNo: "",
    SubdivisionVillageZone: "",
    Street: "",
    District: "",
    barangay: "",
    customBarangay: "",
    city: "",
    customCity: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setGroomBirthDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const goToNextPage = () => {
    if (
      !groomName ||
      !groomPhone ||
      !groomBirthDate ||
      !groomOccupation ||
      !groomReligion ||
      !groomFather ||
      !groomMother ||
      !address.Street ||
      !address.District ||
      !address.barangay ||
      !address.city ||
      (address.barangay === "Others" && !address.customBarangay) ||
      (address.city === "Others" && !address.customCity)
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const groomAddress = {
      ...address,
      barangay: address.barangay,
      customBarangay:
        address.barangay === "Others" ? address.customBarangay : "",
      city: address.city,
      customCity: address.city === "Others" ? address.customCity : "",
    };

    navigation.navigate("WeddingForm3", {
      ...route.params,
      groomName,
      groomPhone,
      groomBirthDate: groomBirthDate.toISOString(),
      groomOccupation,
      groomReligion,
      groomFather,
      groomMother,
      groomAddress,
    });
  };
  console.log(route.params);
  return (
    <ScrollView>
      <YStack space="$3" p="$4">
        <Input
          placeholder="Groom's Name"
          value={groomName}
          onChangeText={setGroomName}
        />
        <Input
          placeholder="Phone"
          keyboardType="phone-pad"
          value={groomPhone}
          onChangeText={setGroomPhone}
        />

        <Button onPress={() => setShowDatePicker(true)}>Select Birthday</Button>
        {showDatePicker && (
          <DateTimePicker
            value={groomBirthDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Text>Selected Birthday: {groomBirthDate.toDateString()}</Text>

        <Input
          placeholder="Occupation"
          value={groomOccupation}
          onChangeText={setGroomOccupation}
        />
        <Input
          placeholder="Religion"
          value={groomReligion}
          onChangeText={setGroomReligion}
        />
        <Input
          placeholder="Father's Name"
          value={groomFather}
          onChangeText={setGroomFather}
        />
        <Input
          placeholder="Mother's Name"
          value={groomMother}
          onChangeText={setGroomMother}
        />

        <Label>Address</Label>
        <Input
          placeholder="Building Name / Tower"
          value={address.BldgNameTower}
          onChangeText={(v) => setAddress({ ...address, BldgNameTower: v })}
        />
        <Input
          placeholder="Lot / Block / Phase / House No."
          value={address.LotBlockPhaseHouseNo}
          onChangeText={(v) =>
            setAddress({ ...address, LotBlockPhaseHouseNo: v })
          }
        />
        <Input
          placeholder="Subdivision / Village / Zone"
          value={address.SubdivisionVillageZone}
          onChangeText={(v) =>
            setAddress({ ...address, SubdivisionVillageZone: v })
          }
        />
        <Input
          placeholder="Street"
          value={address.Street}
          onChangeText={(v) => setAddress({ ...address, Street: v })}
        />
        <Input
          placeholder="District"
          value={address.District}
          onChangeText={(v) => setAddress({ ...address, District: v })}
        />

       {/* Barangay Select */}
<Label>Barangay</Label>
<Picker
  selectedValue={address.barangay}
  onValueChange={(val) => setAddress({ ...address, barangay: val })}
>
  <Picker.Item label="Select Barangay" value="" />
  {barangayOptions.map((item, index) => (
    <Picker.Item key={index} label={item} value={item} />
  ))}
</Picker>

{address.barangay === "Others" && (
  <Input
    placeholder="Enter Barangay"
    value={address.customBarangay}
    onChangeText={(v) => setAddress({ ...address, customBarangay: v })}
  />
)}

<Label>City</Label>
<Picker
  selectedValue={address.city}
  onValueChange={(val) => setAddress({ ...address, city: val })}
>
  <Picker.Item label="Select City" value="" />
  {cityOptions.map((item, index) => (
    <Picker.Item key={index} label={item} value={item} />
  ))}
</Picker>

{address.city === "Others" && (
  <Input
    placeholder="Enter City"
    value={address.customCity}
    onChangeText={(v) => setAddress({ ...address, customCity: v })}
  />
)}



        {error && <Text color="red">{error}</Text>}

        <Tooltip content="Go to next page">
          <Button onPress={goToNextPage} bg="#26572E">
            Next →
          </Button>
        </Tooltip>
      </YStack>
    </ScrollView>
  );
};

export default WeddingForm2;
