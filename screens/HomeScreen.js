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
import DateTimePicker from "@react-native-community/datetimepicker";

const HomeScreen = () => {
  const { logout, token, userId } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({
    alternatePhoneNumber: "",
    country: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    dateOfBirth: "",
    fathersName: "",
    mothersName: "",
    spouseName: "",
    spousePhoneNumber: "",
    numberOfBrothers: "",
    numberOfSisters: "",
    siblingNames: [],
    nativeCity: "",
    nativeDistrict: "",
    nativeState: "",
    sect: "",
    subCaste: "",
  });
  const [siblingNames, setSiblingNames] = useState(
    userInfo?.siblingNames || []
  );
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state to track saving process

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide picker after selection
    if (selectedDate) {
      // Check if the date is selected (not cancelled)
      const currentDate = selectedDate || dateOfBirth;
      setDateOfBirth(currentDate);
      handleChange("dateOfBirth", currentDate.toISOString());
    }
  };

  const ShowDatePicker = () => {
    setShowDatePicker(true);
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

  const handleSave = async () => {
    setIsSaving(true); // Disable the buttons by setting isSaving to true
    try {
      const response = await fetch(`http://192.168.29.12:3000/profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          ...editableUserInfo,
          dateOfBirth: dateOfBirth.toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Profile saved successfully:", result);
      setUserInfo(result);
    } catch (error) {
      console.error("Saving profile failed:", error);
    } finally {
      setIsSaving(false); // Re-enable the buttons whether the API call succeeded or failed
      setIsEditable(false); // Disable editing mode
    }
  };

  const handleChange = (name, value) => {
    setEditableUserInfo((prev) => ({ ...prev, [name]: String(value) }));
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
        if (data) {
          console.log(data);
          setUserInfo(data);
          setDateOfBirth(new Date(data.dateOfBirth)); // Set the dateOfBirth here
          setEditableUserInfo({ ...data }); // Create a new object for editableUserInfo
          setSiblingNames(data.siblingNames || []); // Initialize siblingNames with fetched data
        }
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
    <View style={{ flex: 1 }}>
      {userInfo && (
        <ScrollView style={styles.container}>
          {/* Repeat for other fields... */}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Alternate Phone: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.alternatePhoneNumber === null
                  ? "NA"
                  : String(editableUserInfo.alternatePhoneNumber)
              }
              onChangeText={(text) =>
                handleChange("alternatePhoneNumber", text)
              }
              editable={isEditable}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Country: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.country === null
                  ? "NA"
                  : String(editableUserInfo.country)
              }
              onChangeText={(text) => handleChange("country", text)}
              editable={isEditable}
            />
          </View>
          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>State: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.state === null
                  ? "NA"
                  : String(editableUserInfo.state)
              }
              onChangeText={(text) => handleChange("state", text)}
              editable={isEditable}
            />
          </View>
          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>City: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.city === null
                  ? "NA"
                  : String(editableUserInfo.city)
              }
              onChangeText={(text) => handleChange("city", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>District: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.district === null
                  ? "NA"
                  : String(editableUserInfo.district)
              }
              onChangeText={(text) => handleChange("district", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Pincode: </Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.pincode === null
                  ? "NA"
                  : String(editableUserInfo.pincode)
              }
              onChangeText={(text) => handleChange("pincode", text)}
              editable={isEditable}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            {isEditable ? (
              <TouchableOpacity
                onPress={ShowDatePicker}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerButtonText}>
                  {formatDate(dateOfBirth)}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.value, !isEditable && styles.notEditable]}>
                {formatDate(editableUserInfo.dateOfBirth)}
              </Text>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Father's Name:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.fathersName === null
                  ? "NA"
                  : String(editableUserInfo.fathersName)
              }
              onChangeText={(text) => handleChange("fathersName", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mother's Name:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.mothersName === null
                  ? "NA"
                  : String(editableUserInfo.mothersName)
              }
              onChangeText={(text) => handleChange("mothersName", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Spouse Name:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.spouseName === null
                  ? "NA"
                  : String(editableUserInfo.spouseName)
              }
              onChangeText={(text) => handleChange("spouseName", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Spouse Phone:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.spousePhoneNumber === null
                  ? "NA"
                  : String(editableUserInfo.spousePhoneNumber)
              }
              onChangeText={(text) => handleChange("spousePhoneNumber", text)}
              editable={isEditable}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Number of Brothers:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.numberOfBrothers === null
                  ? "NA"
                  : String(editableUserInfo.numberOfBrothers)
              }
              onChangeText={(text) => handleChange("numberOfBrothers", text)}
              editable={isEditable}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Number of Sisters:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              // if numberOfSisters is NULL, show N/A
              value={
                editableUserInfo.numberOfSisters === null
                  ? "NA"
                  : String(editableUserInfo.numberOfSisters)
              }
              onChangeText={(text) => handleChange("numberOfSisters", text)}
              editable={isEditable}
              keyboardType="number-pad"
              maxLength={2}
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

          <View style={styles.infoRow}>
            <Text style={styles.label}>Native City:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.nativeCity === null
                  ? "NA"
                  : String(editableUserInfo.nativeCity)
              }
              onChangeText={(text) => handleChange("nativeCity", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Native District:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.nativeDistrict === null
                  ? "NA"
                  : String(editableUserInfo.nativeDistrict)
              }
              onChangeText={(text) => handleChange("nativeDistrict", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Native State:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.nativeState === null
                  ? "NA"
                  : String(editableUserInfo.nativeState)
              }
              onChangeText={(text) => handleChange("nativeState", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Sect:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.sect === null
                  ? "NA"
                  : String(editableUserInfo.sect)
              }
              onChangeText={(text) => handleChange("sect", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Subcaste:</Text>
            <TextInput
              style={[styles.value, !isEditable && styles.notEditable]}
              value={
                editableUserInfo.subCaste === null
                  ? "NA"
                  : String(editableUserInfo.subCaste)
              }
              onChangeText={(text) => handleChange("subCaste", text)}
              editable={isEditable}
            />
          </View>

          <View style={styles.separator} />

          {/* ... Add other fields as needed */}
          <View style={styles.buttonContainer}>
            {isEditable ? (
              <>
                <Button title="Save" onPress={handleSave} disabled={isSaving} />
                <Button
                  title="Cancel"
                  onPress={toggleEdit}
                  color="#6c757d"
                  disabled={isSaving}
                />
              </>
            ) : (
              <Button title="Edit" onPress={toggleEdit} />
            )}
          </View>
        </ScrollView>
      )}

      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 40, // If you have this, you can increase it or remove it if the paddingBottom is enough
    paddingBottom: 100, // This adds space at the bottom
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
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
    marginBottom: 20,
  },
  datePickerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
});

export default HomeScreen;
