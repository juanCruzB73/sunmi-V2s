import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileOption from '../../components/profile/ProfileOption';
import LogoutButton from '../../components/profile/LogoutButton';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { onLogin, onLogOut } from '../../redux/slices/authSlice';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(onLogin({ userId: 1, email: 'asdw@gmail.com', password: 'asdw' }));
  }, []);

  const handleTest = () => {
    if (status === 'authenticated') {
      dispatch(onLogOut());
    } else {
      dispatch(onLogin({ userId: 1, email: 'asdw@gmail.com', password: 'asdw' }));
    }
  };

  return (
    <>
      <TopBar navigation={navigation} isProfileScreen />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileHeader name="Pepe Rosa" email={user.email} />
          <View style={styles.optionBox}>
            <ProfileOption icon="bell" label="Notificaciones" onPress={() => {}} />
            <ProfileOption icon="question-circle" label="Ayuda" onPress={() => {}} />
            <ProfileOption icon="cog" label="Configuraciones" onPress={() => {}} />
          </View>
          <LogoutButton />
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 20,
  },
  optionBox: {
    backgroundColor: '#fff',
    width: width * 0.9,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    gap: 12,
  },
});

export default ProfileScreen;