import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

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
