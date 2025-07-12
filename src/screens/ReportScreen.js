import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Button, TextInput, Divider, Snackbar, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import {
  pickImage,
  fetchCurrentLocation,
  fetchCategories,
  sendReport,
  isFormValid
} from '../services/reportService';

const { width: screenWidth } = Dimensions.get('window');

const ReportScreen = () => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [categories, setCategories] = useState([]);

  const handleDeleteImage = (index) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      if (newImages.length === 0) setSelectedImageIndex(0);
      else if (index >= newImages.length) setSelectedImageIndex(newImages.length - 1);
      else setSelectedImageIndex(index);
      return newImages;
    });
  };

  useEffect(() => {
    if (images.length === 0) setSelectedImageIndex(0);
    else if (selectedImageIndex >= images.length)
      setSelectedImageIndex(images.length - 1);
  }, [images]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(err => console.error('Hiba a kategóriák lekérésekor:', err));
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await sendReport({ title, description, categoryId, address, city, zipCode, location, images });
      setSnackbarMessage('Sikeresen beküldve!');
      setSnackbarVisible(true);
      setTitle('');
      setDescription('');
      setCategoryId('');
      setImages([]);
      setLocation(null);
      setAddress('');
      setCity('');
      setZipCode('');
    } catch (error) {
      console.error('Hiba a beküldés során:', error.response?.data || error.message);
      setSnackbarMessage('Hiba a beküldés során');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const formValid = isFormValid({ title, description, zipCode, address, city, categoryId, images });

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={
              images.length > 0
                ? { uri: images[selectedImageIndex].uri }
                : require('../../assets/images/image_placeholder.png')
            }
            style={styles.largePreview}
            resizeMode="cover"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {images.map((img, idx) => (
              <View key={idx} style={styles.thumbnailWrapper}>
                <TouchableOpacity onPress={() => setSelectedImageIndex(idx)}>
                  <Image
                    source={{ uri: img.uri }}
                    style={[
                      styles.thumbnail,
                      idx === selectedImageIndex && styles.selectedThumbnail,
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteImage(idx)}
                >
                  <MaterialCommunityIcons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <Button
            mode="outlined"
            icon="camera"
            onPress={pickImage}
            style={styles.imageButton}
            textColor="#6BAEA1"
            theme={{ colors: { primary: '#6db2a1' } }}
          >
            Kép feltöltése (max 3)
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={{ margin: 16 }}>
          <TextInput
            label="Bejelentés megnevezése"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            outlineColor="rgba(107, 174, 161, 0.3)"
            style={[styles.input, { backgroundColor: '#FFFFFF' }]}
            theme={{ colors: { primary: '#6db2a1' } }}
          />

          <View style={[styles.input, styles.pickerContainer]}>
            <Picker
              selectedValue={categoryId}
              onValueChange={(itemValue) => setCategoryId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Válassz kategóriát..." value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.categoryName} value={cat.id} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <TextInput
              label="Város"
              value={city}
              onChangeText={setCity}
              mode="outlined"
              outlineColor="rgba(107, 174, 161, 0.3)"
              style={[styles.input, { backgroundColor: '#FFFFFF', flex: 1, }]}
              theme={{ colors: { primary: '#6db2a1' } }}
            />
            <TextInput
              label="Irányítószám"
              value={zipCode}
              onChangeText={setZipCode}
              mode="outlined"
              outlineColor="rgba(107, 174, 161, 0.3)"
              style={[styles.input, { backgroundColor: '#FFFFFF', flex: 1, }]}
              theme={{ colors: { primary: '#6db2a1' } }}
            />
          </View>

          <TextInput
            label="Cím (utca, házszám)"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            outlineColor="rgba(107, 174, 161, 0.3)"
            style={[styles.input, { backgroundColor: '#FFFFFF' }]}
            theme={{ colors: { primary: '#6db2a1' } }}
          />

          <TextInput
            label="Leírás"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            outlineColor="rgba(107, 174, 161, 0.3)"
            multiline
            style={[styles.inputDescription, { backgroundColor: '#FFFFFF' }]}
            theme={{ colors: { primary: '#6db2a1' } }}
          />

          {location && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Aktuális pozíció"
                />
              </MapView>
            </View>
          )}
          <Button
            mode="outlined"
            icon="crosshairs-gps"
            onPress={fetchCurrentLocation}
            style={styles.locationButton}
            textColor="#6BAEA1"
            theme={{ colors: { primary: '#6db2a1' } }}
          >
            Aktuális pozíció lekérése
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={!formValid}
          >
            {loading ? <ActivityIndicator animating color="#fff" /> : 'Bejelentés beküldése'}
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: 'rgba(107, 174, 161, 0.3)',
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>

  );

};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF8',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageButton: {
    borderColor: "#6BAEA1",
    borderWidth: 1.5,
    borderRadius: 8,
    marginTop: 16,
    width: '90%',
  },
  divider: {
    height: 1,
    opacity: 0.4,
    backgroundColor: '#6FB1A5',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  thumbnailWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedThumbnail: {
    borderColor: '#6db2a1',
    borderWidth: 2,
  },
  deleteIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgba(107, 174, 161, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 8,
  },
  input: {
    marginBottom: 12,
  },
  inputDescription: {
    height: 120,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#6db2a1',
    marginTop: 40,
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
  },
  largePreview: {
    marginTop: 32,
    height: screenWidth * 0.5,
    width: '90%',
    borderRadius: 12,
  },
  locationButton: {
    borderColor: "#6BAEA1",
    borderWidth: 1.5,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 60
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});
