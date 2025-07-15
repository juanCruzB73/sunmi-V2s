import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const url = 'https://bc063767bb1a.ngrok-free.app/api/v1/auth/sign_in';

  const handleLogin = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: "fcasteller@gmail.com",
          password: "2668765",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Login failed", errorData.errors?.[0] || "Unknown error");
        return;
      }

      const result = await response.json();

      // ✅ Get the token from the response headers
      const accessToken = response.headers.get('Access-Token');
      /* const client = response.headers.get('Client');
      const uid = response.headers.get('Uid');
      const bearerToken = response.headers.get('Authorization');
      */
      if (!accessToken) {
        Alert.alert("Login failed", "No token received from server.");
        return;
      }

      // ✅ Save the token to AsyncStorage
      await AsyncStorage.setItem('auth_token', accessToken);

      // ✅ Dispatch to Redux
      dispatch(setToken(accessToken));

      // Optional: save user info, etc.
      // await AsyncStorage.setItem('user_info', JSON.stringify(result.data));

      Alert.alert("Success", result.data?.email || "Logged in!");
      navigation.navigate("Home");

    } catch (err) {
      const errorMessage = (err as Error).message || "Ha ocurrido un error inesperado";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logotopbar.jpeg')} style={styles.logo} />
      </View>
      <InputField placeholder="Usuario" value={email} onChangeText={setEmail} />
      <InputField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <LoginButton label="Ingresar" onPress={handleLogin} />
      <ForgetPassword onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 35,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 1000,
    height: 150,
    resizeMode: 'contain',
  },
  loginButton: {
    width: '100%',
    marginBottom: 8,
  },
});

export default LoginScreen;