import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Képfeltöltés image pickertől 
export const pickImage = async (images, setImages) => {
    if (images.length >= 3) return;

    const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedImage = result.assets[0];
        setImages([...images, pickedImage]);
    }
};

// Pozíció lekérése 
export const fetchCurrentLocation = async (setLocation) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Helyhozzáférés megtagadva');
        return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
};

// Kategóriák betöltése 
export const fetchCategories = async () => {
    const response = await axios.get(`${API_URL}/api/categories/list`);
    return response.data;
};

// Adatküldés backendnek 
export const sendReport = async ({ title, description, categoryId, address, city, zipCode, location, images }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categoryId);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('zipCode', zipCode);

    if (location) {
        formData.append('locationLat', location.latitude.toString());
        formData.append('locationLng', location.longitude.toString());
    }

    images.forEach((img) => {
        const fileName = img.uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('images', {
            uri: img.uri,
            name: fileName,
            type: `image/${fileType}`,
        });
    });

    const token = await AsyncStorage.getItem('token');

    const response = await axios.post(`${API_URL}/api/reports/sendReport`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

//Validáció 
export const isFormValid = ({ title, description, zipCode, address, city, categoryId, images }) => {
    return (
        title.trim() !== '' &&
        description.trim() !== '' &&
        zipCode.trim() !== '' &&
        address.trim() !== '' &&
        city.trim() !== '' &&
        categoryId !== '' &&
        images.length > 0
    );
};

//Felhasználói reportok lekérdezése
export const fetchUserReports = async () => {
    const token = await AsyncStorage.getItem("token")
    const response = await axios.get(`${API_URL}/api/reports/userReports`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

//Intézményi bejelentések lekérdezése
export const fetchAssignedReports = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/reports/assignedReports`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

//Státuszváltás intézményi felhasználótól
export const updateReportStatus = async (reportId, currentStatus, newStatus, comment = 'Mobil státuszváltás') => {
    const token = await AsyncStorage.getItem("token");

    const payload = {
        statusId: newStatus,
    };

    // Csak akkor kell komment, ha nem open ➝ in_progress
    if (!(currentStatus === 'open' && newStatus === 'in_progress')) {
        payload.comment = comment;
    }
    const response = await axios.post(`${API_URL}/api/reports/${reportId}/status`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

