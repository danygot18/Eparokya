import React, { useState } from "react";
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  Select,
  TextArea,
  Label,
} from "tamagui";
import { ScrollView, Alert } from "react-native";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useSelector } from "react-redux";
import TermsAndConditionsModal from "../../../Screens/TermsAndConditionsModal";
import { Pressable } from "react-native";

const prayerTypes = [
  "For the sick and suffering (Para sa mga may sakit at nagdurusa)",
  "For those who have died (Para sa mga namatay na)",
  "Special Intentions(Natatanging Kahilingan)",
  "For family and friends (Para sa pamilya at mga kaibigan)",
  "For those who are struggling (Para sa mga nahihirapan/naghihirap)",
  "For peace and justice (Para sa kapayapaan at katarungan)",
  "For the Church (Para sa Simbahan)",
  "For vocations (Para sa mga bokasyon)",
  "For forgiveness of sins (Para sa kapatawaran ng mga kasalanan)",
  "For guidance and wisdom (Para sa gabay at karunungan)",
  "For strength and courage (Para sa lakas at tapang)",
  "For deeper faith and love (Para sa mas malalim na pananampalataya at pag-ibig)",
  "For perseverance (Para sa pagtitiyaga/pagtitiis)",
  "Others (Iba pa)",
];

const PrayerRequestIntentionForm = () => {
  const [formData, setFormData] = useState({
    offerrorsName: "",
    prayerType: "",
    addPrayer: "",
    prayerDescription: "",
    prayerRequestDate: "",
    prayerRequestTime: "",
    intentions: [{ name: "" }],
  });

  const { user, token } = useSelector((state) => state.auth);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIntentionChange = (index, value) => {
    const updated = [...formData.intentions];
    updated[index].name = value;
    setFormData((prev) => ({ ...prev, intentions: updated }));
  };

  const handleAddIntention = () => {
    setFormData((prev) => ({
      ...prev,
      intentions: [...prev.intentions, { name: "" }],
    }));
  };

  const handleRemoveIntention = (index) => {
    if (formData.intentions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        intentions: prev.intentions.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.offerrorsName ||
      !formData.prayerType ||
      !formData.prayerRequestDate
    ) {
      Toast.show({ type: "error", text1: "Please fill all required fields!" });
      return;
    }

    if (formData.prayerType === "Others (Iba pa)" && !formData.addPrayer) {
      Toast.show({ type: "error", text1: "Please specify your prayer type." });
      return;
    }

    try {
      const payload = {
        ...formData,
        userId: user?._id,
        Intentions: formData.intentions.map((i) => ({ name: i.name })),
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `${baseURL}/prayerRequestIntention/submit`,
        payload,
        config
      );

      Toast.show({ type: "success", text1: "Prayer submitted successfully." });
      handleClear();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Submission failed",
      });
    }
  };

  const handleClear = () => {
    setFormData({
      offerrorsName: "",
      prayerType: "",
      addPrayer: "",
      prayerDescription: "",
      prayerRequestDate: "",
      prayerRequestTime: "",
      intentions: [{ name: "" }],
    });
  };

  return (
    <ScrollView>
      <YStack padding="$4" space="$3">
        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          Prayer Request Form
        </Text>

        <Label>Full Name</Label>
        <Input
          value={formData.offerrorsName}
          onChangeText={(val) => handleChange("offerrorsName", val)}
          placeholder="Enter your full name"
        />

        <Label>Prayer Type</Label>
        <Select
          value={formData.prayerType}
          onValueChange={(val) => handleChange("prayerType", val)}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select prayer type..." />
          </Select.Trigger>

          <Select.Content>
            {prayerTypes.map((type) => (
              <Select.Item key={type} value={type}>
                <Select.ItemText>{type}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {formData.prayerType === "Others (Iba pa)" && (
          <>
            <Label>Specify Other Prayer Type</Label>
            <Input
              value={formData.addPrayer}
              onChangeText={(val) => handleChange("addPrayer", val)}
              placeholder="Iba pa..."
            />
          </>
        )}

        <Label>Prayer Description</Label>
        <TextArea
          numberOfLines={4}
          value={formData.prayerDescription}
          onChangeText={(val) => handleChange("prayerDescription", val)}
          placeholder="Write your prayer intention description here..."
        />

        <Label>Prayer Request Date</Label>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <Input
            pointerEvents="none"
            editable={false}
            value={
              formData.prayerRequestDate
                ? new Date(formData.prayerRequestDate).toLocaleDateString()
                : ""
            }
            placeholder="Select Date"
          />
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={
              formData.prayerRequestDate
                ? new Date(formData.prayerRequestDate)
                : new Date()
            }
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === "set" && selectedDate) {
                handleChange("prayerRequestDate", selectedDate.toISOString());
              }
            }}
          />
        )}

        <Label>Prayer Request Time (Optional)</Label>
        <Pressable onPress={() => setShowTimePicker(true)}>
          <Input
            pointerEvents="none"
            editable={false}
            value={
              formData.prayerRequestTime
                ? new Date(formData.prayerRequestTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            placeholder="Select Time"
          />
        </Pressable>

        {showTimePicker && (
          <DateTimePicker
            value={
              formData.prayerRequestTime
                ? new Date(formData.prayerRequestTime)
                : new Date()
            }
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (event.type === "set" && selectedTime) {
                handleChange("prayerRequestTime", selectedTime.toISOString());
              }
            }}
          />
        )}

        <Label>Special Intentions</Label>
        {formData.intentions.map((item, index) => (
          <XStack key={index} alignItems="center" space="$2">
            <Input
              value={item.name}
              onChangeText={(val) => handleIntentionChange(index, val)}
              placeholder={`Intention #${index + 1}`}
              flex={1}
            />
            <Button
              theme="red"
              size="$2"
              onPress={() => handleRemoveIntention(index)}
            >
              Remove
            </Button>
          </XStack>
        ))}
        <Button theme="green" size="$3" mt="$2" onPress={handleAddIntention}>
          Add Intention
        </Button>

        <YStack space="$2" mt="$4">
          <Button theme="gray" onPress={handleClear}>
            Clear All Fields
          </Button>

          <Button theme="active" onPress={() => setShowTermsModal(true)}>
            Submit
          </Button>
        </YStack>

        {/* Terms Modal */}
        <TermsAndConditionsModal
          isVisible={showTermsModal}
          onAgree={() => {
            setShowTermsModal(false);
            handleSubmit();
          }}
          onCancel={() => setShowTermsModal(false)}
        />
      </YStack>
    </ScrollView>
  );
};

export default PrayerRequestIntentionForm;
