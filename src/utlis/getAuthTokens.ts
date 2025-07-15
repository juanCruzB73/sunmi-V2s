import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthTokenHeader } from "../types/IAuthTokenHeader";

const getAuthTokens = async () => {
  try {
    const values = await AsyncStorage.multiGet(['accessToken', 'client', 'uid']);
    const tokens: IAuthTokenHeader = {};
    values.forEach(([key, value]) => {
      if (value) tokens[key as keyof IAuthTokenHeader] = value;
    });
    return tokens;
  } catch (e) {
    console.error('Failed to load tokens:', e);
    return {};
  }
};
