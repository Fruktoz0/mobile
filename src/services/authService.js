import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_URL } from "../config/apiConfig";
import { getErrorMessage } from '../utils/getErrorMessage';

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (err) {
    console.error("Token lekérés hiba:", err);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = await getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password, });
    if (response.status === 200) {
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
    }
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }

}

export const register = async (username, email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, { username, email, password, confirmPassword });
    return response;
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
};
