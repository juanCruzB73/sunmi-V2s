import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions, Alert,
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

type Props = NativeStackScreenProps<RootStackParamList, 'profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user)
    return (
      <>
        <TopBar navigation={navigation} isProfileScreen />
        <View style={styles.container}>
          <ProfileHeader
            name={user.name}
            email={user.email}
          />
          <View style={styles.optionBox}>
            <ProfileOption icon="bell" label="Notificaciones" onPress={() => {}} />
            <ProfileOption icon="question-circle" label="Ayuda" onPress={() => {}} />
            <ProfileOption icon="cog" label="Configuraciones" onPress={() => {}} />
          </View>
        </View>
          <LogoutButton />
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