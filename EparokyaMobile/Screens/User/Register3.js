import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input.js";
import RNPickerSelect from "react-native-picker-select";
import { barangays } from "../../assets/common/barangays.js"; // Fix the import

var { height, width } = Dimensions.get("window");

const Register3 = () => {
    const route = useRoute();
    const {
        email,
        name,
        password,
        selectedImage,
        birthday,
        preference,
        civilStatus,
        phone,
        ministryRoles,
    } = route.params;
    const navigation = useNavigation();

    const [user, setUser] = useState({
        name: name,
        email: email,
        password: password,
        selectedImage: selectedImage,
        birthday: birthday,
        preference: preference,
        civilStatus: civilStatus,
        phone: phone,
        ministryRoles: ministryRoles,
        address: {
            BldgNameTower: "",
            LotBlockPhaseHouseNo: "",
            SubdivisionVillageZone: "",
            Street: "",
            District: "",
            barangay: "",
            city: "",
        },
    });

    const [error, setError] = useState("");

    const goToNextPage = () => {
        if (
            !user.address.barangay ||
            !user.address.BldgNameTower ||
            !user.address.LotBlockPhaseHouseNo ||
            !user.address.SubdivisionVillageZone ||
            !user.address.Street ||
            !user.address.District ||
            !user.address.city 
        ) {
            setError("Please fill in the address fields correctly");
            return;
        }

        // Navigate to Register4 with all the collected data
        navigation.navigate("Register4", {
            email: user.email,
            name: user.name,
            password: user.password,
            selectedImage: user.selectedImage,
            birthday: user.birthday,
            preference: user.preference,
            civilStatus: user.civilStatus,
            phone: user.phone,
            ministryRoles: user.ministryRoles,
            address: user.address, // Pass the address data
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <FormContainer>
                    <Text style={styles.label}>Address</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Barangay</Text>
                        <RNPickerSelect
                            placeholder={{ label: "Select Barangay", value: null }}
                            onValueChange={(value) =>
                                setUser({
                                    ...user,
                                    address: { ...user.address, barangay: value },
                                })
                            }
                            items={barangays.map((barangay) => ({
                                label: barangay,
                                value: barangay,
                            }))}
                            style={pickerSelectStyles}
                            value={user.address.barangay}
                        />
                    </View>
                    <Input
                        placeholder={"Building Name/Tower"}
                        name={"BldgNameTower"}
                        id={"BldgNameTower"}
                        onChangeText={(text) =>
                            setUser({
                                ...user,
                                address: { ...user.address, BldgNameTower: text },
                            })
                        }
                    />
                    <Input
                        placeholder={"Lot/Block/Phase/House No."}
                        name={"LotBlockPhaseHouseNo"}
                        id={"LotBlockPhaseHouseNo"}
                        onChangeText={(text) =>
                            setUser({
                                ...user,
                                address: { ...user.address, LotBlockPhaseHouseNo: text },
                            })
                        }
                    />
                    <Input
                        placeholder={"Subdivision/Village/Zone"}
                        name={"SubdivisionVillageZone"}
                        id={"SubdivisionVillageZone"}
                        onChangeText={(text) =>
                            setUser({
                                ...user,
                                address: { ...user.address, SubdivisionVillageZone: text },
                            })
                        }
                    />
                    <Input
                        placeholder={"Street"}
                        name={"Street"}
                        id={"Street"}
                        onChangeText={(text) =>
                            setUser({
                                ...user,
                                address: { ...user.address, Street: text },
                            })
                        }
                    />
                    <Input
                        placeholder={"District"}
                        name={"District"}
                        id={"District"}
                        onChangeText={(text) =>
                            setUser({
                                ...user,
                                address: { ...user.address, District: text },
                            })
                        }
                    />
                    <RNPickerSelect
                        placeholder={{ label: "Select City", value: null }}
                        onValueChange={(value) =>
                            setUser({
                                ...user,
                                address: { ...user.address, city: value },
                            })
                        }
                        items={[
                            { label: "Taguig City", value: "Taguig City" },
                            { label: "Others", value: "Others" },
                        ]}
                        style={pickerSelectStyles}
                        value={user.address.city}
                    />

                    <View style={styles.buttonGroup}>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    <Button onPress={goToNextPage} style={styles.registerButton}>
                        <Text style={styles.buttonText}>Next</Text>
                    </Button>
                </FormContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    label: {
        fontSize: 16,
        color: "#000",
        marginBottom: 5,
    },
    inputContainer: {
        marginBottom: 20,
        width: "80%",
    },
    buttonGroup: {
        width: "100%",
        margin: 10,
        alignItems: "center",
    },
    registerButton: {
        backgroundColor: "#1C5739",
        width: "80%",
        borderRadius: 20,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        color: "black",
        paddingRight: 30,
        width: "100%",
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        color: "black",
        paddingRight: 30,
        width: "100%",
    },
});

export default Register3;