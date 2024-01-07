import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import CountryPicker from 'react-native-country-picker-modal';

const HomeScreen = () => {
  const { logout, token, userId } = useContext(AuthContext);

  const userInfo = {
    alternatePhoneNumber: "7297814005",
    city: "Mumbai",
    country: "India",
    createdAt: "2024-01-03T12:15:00.104Z",
    dateOfBirth: "2002-08-08T00:00:00.000Z",
    district: "Mumbai",
    facebook: "facebook_username",
    fathersName: "Billy Butcher",
    id: 1,
    instagram: "instagram_username",
    linkedin: "linkedin_username",
    mothersName: "Starlight",
    nativeCity: "Mumbai",
    nativeDistrict: "Mumbai District",
    nativeState: "Maharashtra",
    numberOfBrothers: 2,
    numberOfSisters: 1,
    pincode: "400001",
    sect: "Digambar",
    siblingNames: ["Dr Ford", "Ragnar", "Mukul"],
    spouseName: "Kate Earl",
    spousePhoneNumber: "9462221313",
    state: "Maharashtra",
    subCaste: "Subcaste Name",
    updatedAt: "2024-01-03T12:15:00.104Z",
    userId: 13,
  };

  const [isEditable, setIsEditable] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState(userInfo);
  const [siblingNames, setSiblingNames] = useState(userInfo.siblingNames || []);
  const [country, setCountry] = useState(userInfo.country);

  
  const onSelect = (country) => {
    setCountry(country);
  };

  const addSiblingField = () => {
    setSiblingNames([...siblingNames, ""]);
  };

  const updateSiblingName = (index, name) => {
    const updatedSiblings = [...siblingNames];
    updatedSiblings[index] = name;
    setSiblingNames(updatedSiblings);
  };

  const removeSiblingField = (index) => {
    const updatedSiblings = siblingNames.filter((_, idx) => idx !== index);
    setSiblingNames(updatedSiblings.length > 0 ? updatedSiblings : ["N/A"]);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSave = () => {
    // Logic to save the editableUserInfo to the backend
    setIsEditable(false);
    const filteredSiblings = siblingNames.filter(
      (name) => name && name !== "N/A"
    );
    setSiblingNames(filteredSiblings.length > 0 ? filteredSiblings : ["N/A"]);
  };

  const handleChange = (name, value) => {
    setEditableUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }
        if (!userId) {
          throw new Error("No userId found");
        }
        const response = await fetch(
          `http://192.168.29.12:3000/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        {/* Repeat for other fields... */}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Alternate Phone: </Text>
          <TextInput
            style={[styles.value, !isEditable && styles.notEditable]}
            value={editableUserInfo.alternatePhoneNumber}
            onChangeText={(text) => handleChange("alternatePhoneNumber", text)}
            editable={isEditable}
            keyboardType="phone-pad" 
            maxLength={10} 
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Father's Name:</Text>
          <TextInput
            style={[styles.value, !isEditable && styles.notEditable]}
            value={editableUserInfo.fathersName}
            onChangeText={(text) => handleChange("fathersName", text)}
            editable={isEditable}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
            <Text style={styles.label}>Mother's Name:</Text>
            <TextInput
                style={[styles.value, !isEditable && styles.notEditable]}
                value={editableUserInfo.mothersName}
                onChange={(text) => handleChange("mothersName", text)}
                editable={isEditable}
            />
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
            <Text style={styles.label}>Spouse Name:</Text>
            <TextInput
                style={[styles.value, !isEditable && styles.notEditable]}
                value={editableUserInfo.spouseName}
                onChange={(text) => handleChange("spouseName", text)}
                editable={isEditable}
            />
        </View>
        
         
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Siblings:</Text>
          <View style={styles.siblingContainer}>
            {siblingNames.map((name, index) => (
              <View key={`sibling-${index}`} style={styles.siblingField}>
                <TextInput
                  style={[
                    styles.value,
                    styles.siblingInput,
                    !isEditable && styles.notEditable,
                  ]}
                  value={name}
                  onChangeText={(text) => updateSiblingName(index, text)}
                  editable={isEditable}
                  placeholder="Enter sibling's name"
                />
                {isEditable && (
                  <TouchableOpacity
                    onPress={() => removeSiblingField(index)}
                    style={styles.removeButton}
                  >
                    <FontAwesome name="remove" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditable && (
              <TouchableOpacity
                onPress={addSiblingField}
                style={styles.addButton}
              >
                <FontAwesome name="plus" size={24} color="blue" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.separator} />

        {/* ... Add other fields as needed */}
        <View style={styles.buttonContainer}>
          {isEditable ? (
            <>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={toggleEdit} color="#6c757d" />
            </>
          ) : (
            <Button title="Edit" onPress={toggleEdit} />
          )}
        </View>
      </ScrollView>

      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    width: 120,
    fontWeight: "500",
  },
  value: {
    borderBottomWidth: 1,
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  notEditable: {
    color: "#666",
    borderBottomWidth: 0,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  siblingContainer: {
    flex: 1,
    marginTop: 10,
  },
  siblingField: {
    flexDirection: "row",
    alignItems: "center",
  },
  siblingInput: {
    flex: 1,
    marginRight: 10,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButton: {
    padding: 10,
    alignItems: "center",
  },
  removeButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default HomeScreen;

