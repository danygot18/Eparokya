import React from "react";
import { Modal, View } from "react-native";
import { Button, Text, VStack, ScrollView } from "native-base";
import TermsAndCondition from "../Screens/TermsAndCondition";

const TermsAndConditionsModal = ({ isVisible, onAgree, onClose }) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 8,
            width: "85%",
            maxHeight: "80%",
          }}
        >
          <ScrollView>
            <VStack space={4}>
              <Text fontSize="lg" fontWeight="bold">
                Terms and Conditions
              </Text>

              <TermsAndCondition />

              <Button
                onPress={() => {
                  console.log("I Agree pressed");
                  onAgree();
                }}
                colorScheme="green"
              >
                I Agree
              </Button>

              <Button onPress={onClose} variant="ghost" colorScheme="gray">
                Close
              </Button>
            </VStack>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TermsAndConditionsModal;
