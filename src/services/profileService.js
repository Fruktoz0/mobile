import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from '../utils/getErrorMessage';


//Avatar csere
export const changeAvatar = async () => {
    try {
        const token = await AsyncStorage.getItem('token')
        const response = await axios.post(`${API_URL}/api/users/changeAvatar`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    } catch (error) {
        console.error('Nem sikerült avatart cserélni:', error);
    }
}

export const getUserProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return null;

        const response = await axios.get(`${API_URL}/api/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Hiba történt a felhasználó adatainak betöltésekor', error.message);
        return null;
    }
};

export const updateUserProfile = async (userId, userData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(`${API_URL}/api/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Hiba történt a felhasználói adatok frissítésekor', error);
    }
};

export const updateInstitutionProfile = async (institutionId, institutionData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(`${API_URL}/api/institutions/update/${institutionId}`, institutionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Hiba történt az intézményi adatok frissítésekor', error);
    }
}
