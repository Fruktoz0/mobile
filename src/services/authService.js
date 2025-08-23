import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_URL } from "../config/apiConfig";

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
    console.error("User decode hiba:", err);
    return null;
  }
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, { email, password, });
  if (response.status === 200) {
    const token = response.data.token;
    await AsyncStorage.setItem("token", token);
  }
  return response;
}

export const register = async (username, email, password, confirmPassword) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, { username, email, password, confirmPassword });
  if (response.status === 201) {
    const token = response.data.token;
    await AsyncStorage.setItem("token", token);
  }
  return response;
};
