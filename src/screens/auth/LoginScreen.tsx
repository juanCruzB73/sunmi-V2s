import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
// import { startLogIn } from '../../redux/slices/authThunk';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const url = 'https://fc15b9ccbd00.ngrok-free.app/api/v1/auth/sign_in'; // or your actual endpoint

const handleLogin = async () => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Accept": "application/json", // Optional but recommended
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

    Alert.alert("Success", result.data?.email || "Logged in!");

    // navigation.navigate("Home");
  } catch (err) {
    Alert.alert("Error", err.message);
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