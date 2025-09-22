import { StyleSheet, View, ScrollView, TouchableOpacity, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { Mail, User, SquarePen, Building2, MapPinHouse, BookUser, ShieldUser, Clock8 } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, Divider, List, TextInput, Button } from 'react-native-paper';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { getUserProfile } from '../../services/profileService';
import { updateUserProfile, updateInstitutionProfile } from '../../services/profileService';


function UserdataScreen() {

  const navigation = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadUser = async () => {
    const data = await getUserProfile();
    if (data) {
      setUserData(data);
      setFormData(data)
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  // Mentés gombokhoz
  const handleSave = async () => {
    try {
      if (selectedIndex === 0) {
        // Felhasználói adatok mentése
        await updateUserProfile(userData.id, {
          username: formData.username,
          zipCode: formData.zipCode,
          city: formData.city,
          address: formData.address,
        });
      } else {
        // Intézményi adatok mentése
        await updateInstitutionProfile(userData.institution.id, {
          name: formData.institution.name,
          email: formData.institution.email,
          description: formData.institution.description,
          contactInfo: formData.institution.contactInfo,
        });
      }

      setIsEditing(false);
      loadUser(); // frissítsük a nézetet mindig a teljes user betöltésével
    } catch (err) {
      console.error("Mentés hiba:", err);
    }
  };


  const values = userData?.role === "user"
    ? ['Felhasználói adatok']
    : ['Felhasználói adatok', 'Intézményi adatok'];

  const roleLabels = {
    user: "Felhasználó",
    admin: "Adminisztrátor",
    institution: "Intézményi felhasználó",
    worker: "Intézményi munkavállaló",
    compliance: "Megfelelőségi felhasználó"
  }

  // Amíg nem tölti be az adatokat ez jelenik meg
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Betöltés...</Text>
      </View>
    )
  }

  //Ha betöltötte az adatokat rendes nézet beöltése
  return (
    <ScrollView style={styles.container}>
      <View >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.backText}>Felhasználói adatok</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <SquarePen size={20} style={{ marginLeft: 8, marginRight: 16 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          {values.length > 1 && (
            <SegmentedControl
              style={{ backgroundColor: "#f7f7f7", }}
              values={values}
              selectedIndex={selectedIndex}
              onChange={(event) => {
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          )}
        </View>

        {/* Szerkesztői nézet*/}
        {isEditing ? (
          <>
            {selectedIndex === 0 && (
              <View style={{ margin: 16 }}>
                <TextInput
                  label="Felhasználónév"
                  value={formData.username}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  mode="outlined"
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />
           
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <TextInput
                    label="Irányítószám"
                    value={formData.zipCode}
                    onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    style={[styles.input, { backgroundColor: '#FFFFFF', flex: 1 }]}
                    theme={{ colors: { primary: '#6db2a1' } }}
                  />
                  <TextInput
                    label="Város"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    style={[styles.input, { backgroundColor: '#FFFFFF', flex: 1 }]}
                    theme={{ colors: { primary: '#6db2a1' } }}
                  />
                </View>
                <TextInput
                  label="Cím"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  mode="outlined"
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />

                <Button
                  mode="contained"
                  onPress={() => handleSave()}
                  style={styles.submitButton}
                >
                  Mentés
                </Button>
              </View>
            )}

            {selectedIndex === 1 && (
              <View style={{ margin: 16 }}>
                <TextInput
                  label="Intézmény neve"
                  value={formData.institution?.name}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      institution: { ...formData.institution, name: text }
                    })
                  }
                  mode="outlined"
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />
                <TextInput
                  label="Intézményi email"
                  value={formData.institution?.email}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      institution: { ...formData.institution, email: text }
                    })
                  }
                  mode="outlined"
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />
                <TextInput
                  label="Leírás"
                  value={formData.institution?.description}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      institution: { ...formData.institution, description: text }
                    })
                  }
                  mode="outlined"
                  multiline
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.inputDescription, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />
                <TextInput
                  label="Cím / Kapcsolat"
                  value={formData.institution?.contactInfo}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      institution: { ...formData.institution, contactInfo: text }
                    })
                  }
                  mode="outlined"
                  outlineColor="rgba(107, 174, 161, 0.3)"
                  style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                  theme={{ colors: { primary: '#6db2a1' } }}
                />

                <Button
                  mode="contained"
                  onPress={() => handleSave()}
                  style={styles.submitButton}
                >
                  Mentés
                </Button>
              </View>
            )}
          </>

        ) : (
          /* Megjelenítő nézet */
          <>
            {selectedIndex === 0 && (
              <List.Section style={styles.dataContainer}>
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Felhasználónév</Text>}
                  description={<Text style={styles.descriptionText}>{userData.username}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <User size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Email</Text>}
                  description={<Text style={styles.descriptionText}>{userData.email}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <Mail size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Jogosultság</Text>}
                  description={<Text style={styles.descriptionText}>{roleLabels[userData.role] || userData.role}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <ShieldUser size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Irányítószám</Text>}
                  description={<Text style={styles.descriptionText}>{userData.zipCode || "Nincs kitöltve"}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <BookUser size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Város</Text>}
                  description={<Text style={styles.descriptionText}>{userData.city || "Nincs kitöltve"}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <Building2 size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Lakcím</Text>}
                  description={<Text style={styles.descriptionText}>{userData.address || "Nincs kitöltve"}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <MapPinHouse size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
              </List.Section>
            )}

            {/*Intézményi adatok */}
            {selectedIndex === 1 && userData?.institution && (
              <List.Section style={styles.dataContainer}>
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Felhasználóhoz tartozó intézmény</Text>}
                  description={<Text style={styles.descriptionText}>{userData.institution.name}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <User size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Email elérhetőség</Text>}
                  description={<Text style={styles.descriptionText}>{userData.institution.email}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <Mail size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Jogosultság</Text>}
                  description={<Text style={styles.descriptionText}>{roleLabels[userData.role] || userData.role}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <ShieldUser size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Intézmény leírása</Text>}
                  description={<Text style={styles.descriptionText}>{userData.institution.description}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <BookUser size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Intézmény címe</Text>}
                  descriptionNumberOfLines={null}
                  description={<Text style={styles.descriptionText}>{userData.institution.contactInfo}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <Building2 size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />
                <List.Item
                  style={styles.item}
                  title={<Text style={styles.listTitle}>Létrehozva</Text>}
                  description={<Text style={styles.descriptionText}>{formatDate(userData.institution.createdAt)}</Text>}
                  left={() => (
                    <View style={{
                      borderRadius: 12,
                      padding: 8,
                    }}>
                      <Clock8 size={22} color={'grey'} />
                    </View>
                  )} />
                <Divider style={styles.divider} />

              </List.Section>

            )}
          </>
        )}
      </View>
    </ScrollView >

  )
}


export default UserdataScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  body: {
    marginStart: 8,
    marginEnd: 8
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  header: {
    marginStart: 16,
    paddingTop: 36,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataContainer: {
    paddingHorizontal: 34,
  },
  descriptionText: {
    fontSize: 17,
  },
  listTitle: {
    fontSize: 14,
    color: 'grey',
  },
  divider: {
    marginLeft: 50,
  },
  toggleContainer: {
    marginVertical: 12,
    paddingHorizontal: 28,
  },

  //Szerkesztői nézet formázás
  input: {
    marginBottom: 12,
  },
  inputDescription: {
    height: 120,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#6db2a1',
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
  },



})