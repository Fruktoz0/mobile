import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


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