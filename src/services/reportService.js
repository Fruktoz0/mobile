import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCategories = async () => {
    const response = await axios.get(`${API_URL}/api/categories/list`);
    return response.data;
}


