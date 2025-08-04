import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar navigation={navigation} isProfileScreen />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <ProfileHeader name={user.name} email={user.email} />

          <View style={styles.optionBox}>
            <ProfileOption icon="bell" label="Notificaciones" onPress={() => {}} />
            <ProfileOption icon="question-circle" label="Ayuda" onPress={() => {}} />
            <ProfileOption icon="cog" label="Configuraciones" onPress={() => {}} />
          </View>

          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 24,
  },
  optionBox: {
    backgroundColor: '#ffffff',
    width: width * 0.9,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    gap: 16,
  },
});

export default ProfileScreen;