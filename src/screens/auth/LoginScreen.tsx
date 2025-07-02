import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image, Text } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor completa email y contraseña.');
      return;
    }

    // Aquí podrías agregar lógica de autenticación real
    Alert.alert('Inicio de sesión', `Email: ${email}\nContraseña: ${password}`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar contraseña', 'Función no implementada todavía 😅');
  };

  return (
    <View style={styles.container}>
      {/* Logo inline definido anteriormente */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logotopbar.jpeg')} style={styles.logo} />
      </View>

      <InputField
        placeholder="Usuario"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <LoginButton label="Ingresarr" onPress={handleLogin} />

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
    marginBottom: 8, // Espacio entre el botón y el enlace
  },

});

export default LoginScreen;