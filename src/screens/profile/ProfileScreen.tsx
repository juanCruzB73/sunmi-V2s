import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileOption from '../../components/profile/ProfileOption';
import LogoutButton from '../../components/profile/LogoutButton';

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ProfileHeader
        name="Pepe Rosa"
        email="pepe.rosa@lascondes.com"
      />

      <ProfileOption icon="bell" label="Notificaciones" onPress={() => {}} />
      <ProfileOption icon="question-circle" label="Ayuda" onPress={() => {}} />
      <ProfileOption icon="cog" label="Configuraciones" onPress={() => {}} />

      <LogoutButton onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
});

export default ProfileScreen;