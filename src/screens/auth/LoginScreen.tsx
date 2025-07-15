import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image } from 'react-native';
import InputField from '../../components/login/InputField';
import LoginButton from '../../components/login/LoginButton';
import ForgetPassword from '../../components/login/ForgetPassword';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { startOnLogIn } from '../../redux/slices/authThunk';
import { AppDispatch, RootState } from '../../redux/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('fcasteller@gmail.com');
  const [password, setPassword] = useState('2668765');
  
  const dispatch = useDispatch<AppDispatch>()


  const handleLogin = async () => {
    try {
      const success = await dispatch(startOnLogIn({ email, password }));
      
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