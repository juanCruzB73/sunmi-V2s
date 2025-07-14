import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const HEADER_KEY = "authHeaders";

export const SessionService = {
  saveHeaders: async (headers: {
    accessToken: string;
    client: string;
    uid: string;
  }) => {
    try {
      await AsyncStorage.setItem(HEADER_KEY, JSON.stringify(headers));
    } catch (err) {
      console.error("Error al guardar headers:", err);
    }
  },

  getHeaders: async (): Promise<{
    accessToken: string;
    client: string;
    uid: string;
  } | null> => {
    try {
      const raw = await AsyncStorage.getItem(HEADER_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      // Validación básica
      if (
        typeof parsed.accessToken === "string" &&
        typeof parsed.client === "string" &&
        typeof parsed.uid === "string"
      ) {
        return parsed;
      }
      return null;
    } catch (err) {
      console.error("Error al leer headers:", err);
      return null;
    }
  },

  clearHeaders: async () => {
    try {
      await AsyncStorage.removeItem(HEADER_KEY);
    } catch (err) {
      console.error("Error al borrar headers:", err);
    }
  },

  // 👇 Para testing rápido, opcional
  debugHeaders: async () => {
    const headers = await SessionService.getHeaders();
    Alert.alert(
      "Headers guardados",
      headers ? JSON.stringify(headers, null, 2) : "No se encontraron headers"
    );
  },
};