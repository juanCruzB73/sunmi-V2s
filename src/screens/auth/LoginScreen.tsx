import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useNetworkStatus } from '../../utlis/useNetworkStatus';
// import { startLogIn } from '../../redux/slices/authThunk';
import { IUser } from '../../types/IUser';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isOnline = useNetworkStatus();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor completa email y contraseña.');
      return;
    }

    if (!isOnline) {
      Alert.alert('Sin conexión', 'Necesitas conexión a Internet para iniciar sesión.');
      return;
    }

    // await dispatch(startLogIn(email, password));
    navigation.navigate('Home');
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