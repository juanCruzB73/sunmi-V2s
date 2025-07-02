import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileOption from '../../components/profile/ProfileOption';
import LogoutButton from '../../components/profile/LogoutButton';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'profile'>;


const ProfileScreen= ({navigation}:Props) => {
  return (
    <>
<TopBar navigation={navigation} isProfileScreen />
    <View style={styles.container}>
      <ProfileHeader
        name="Pepe Rosa"
        email="pepe.rosa@lascondes.com"
      />
      <View style={styles.optionContainer}>
        <ProfileOption icon="bell" label="Notificaciones" onPress={() => {}} />
        <ProfileOption icon="question-circle" label="Ayuda" onPress={() => {}} />
        <ProfileOption icon="cog" label="Configuraciones" onPress={() => {}} />
      </View>
      <LogoutButton />
    </View>
    </>
  );
};

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flex: 1,
    backgroundColor: '#fff',
    width:width,
    height:height * 0.8
  },
  optionContainer:{
    width:width * 0.7,
    display:"flex",
   
  }
});

export default ProfileScreen;