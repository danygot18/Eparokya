import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";

const WeddingForm4 = ({ navigation, route }) => {
  // const { weddingData, userId } = route.params;

  const [ninongs, setNinongs] = useState([
    { name: "", address: { street: "", zip: "", city: "" } },
  ]);
  const [ninangs, setNinangs] = useState([
    { name: "", address: { street: "", zip: "", city: "" } },
  ]);
  const [error, setError] = useState("");

  const handleInputChange = (type, index, field, value, subField = null) => {
    const updater = type === "ninong" ? [...ninongs] : [...ninangs];
    if (subField) {
      updater[index].address[subField] = value;
    } else {
      updater[index].name = value;
    }
    type === "ninong" ? setNinongs(updater) : setNinangs(updater);
  };

  const addEntry = (type) => {
    const newEntry = { name: "", address: { street: "", zip: "", city: "" } };
    type === "ninong"
      ? setNinongs([...ninongs, newEntry])
      : setNinangs([...ninangs, newEntry]);
  };

  const removeEntry = (type, index) => {
    const updated = type === "ninong" ? [...ninongs] : [...ninangs];
    updated.splice(index, 1);
    type === "ninong" ? setNinongs(updated) : setNinangs(updated);
  };

  const goToNextPage = () => {
  const allValid = [...ninongs, ...ninangs].every(
    (item) =>
      item.name &&
      item.address.street &&
      item.address.zip &&
      item.address.city
  );

  if (!allValid) {
    setError("Please fill in all fields.");
    return;
  }

  const updatedWeddingData = {
    ...route.params, // Include all previous data
    sponsors: {
      Ninong: ninongs.map(ninong => ({
        name: ninong.name,
        address: {
          street: ninong.address.street,
          zip: ninong.address.zip,
          city: ninong.address.city
        }
      })),
      Ninang: ninangs.map(ninang => ({
        name: ninang.name,
        address: {
          street: ninang.address.street,
          zip: ninang.address.zip,
          city: ninang.address.city
        }
      }))
    }
  };

  
  navigation.navigate("WeddingForm5", { 
    ...route.params,
    updatedWeddingData,
    // userId: route.params.userId // Make sure to pass userId if needed
  });
};
  console.log(route.params);
  const clearForm = () => {
    setNinongs([{ name: "", address: { street: "", zip: "", city: "" } }]);
    setNinangs([{ name: "", address: { street: "", zip: "", city: "" } }]);
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Ninongs</Text>
      {ninongs.map((ninong, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            placeholder="Ninong's Name"
            value={ninong.name}
            onChangeText={(text) =>
              handleInputChange("ninong", index, "name", text)
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Street"
            value={ninong.address.street}
            onChangeText={(text) =>
              handleInputChange("ninong", index, "address", text, "street")
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Zip"
            value={ninong.address.zip}
            onChangeText={(text) =>
              handleInputChange("ninong", index, "address", text, "zip")
            }
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="City"
            value={ninong.address.city}
            onChangeText={(text) =>
              handleInputChange("ninong", index, "address", text, "city")
            }
            style={styles.input}
          />
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeEntry("ninong", index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity
        onPress={() => addEntry("ninong")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Ninong</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Ninangs</Text>
      {ninangs.map((ninang, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            placeholder="Ninang's Name"
            value={ninang.name}
            onChangeText={(text) =>
              handleInputChange("ninang", index, "name", text)
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Street"
            value={ninang.address.street}
            onChangeText={(text) =>
              handleInputChange("ninang", index, "address", text, "street")
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Zip"
            value={ninang.address.zip}
            onChangeText={(text) =>
              handleInputChange("ninang", index, "address", text, "zip")
            }
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="City"
            value={ninang.address.city}
            onChangeText={(text) =>
              handleInputChange("ninang", index, "address", text, "city")
            }
            style={styles.input}
          />
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeEntry("ninang", index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity
        onPress={() => addEntry("ninang")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Ninang</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={goToNextPage}
          style={[styles.button, styles.nextButton]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearForm}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Clear Fields</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: "#90ee90",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#000", fontWeight: "bold" },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#f08080",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: { color: "#fff" },
  error: { color: "red", marginBottom: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  nextButton: { backgroundColor: "#26572E" },
  clearButton: { backgroundColor: "#B3CF99" },
  buttonText: { color: "white", fontWeight: "bold" },
  clearButtonText: { color: "black", fontWeight: "bold" },
});

export default WeddingForm4;
