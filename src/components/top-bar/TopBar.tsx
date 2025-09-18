import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, Text, Animated, Easing } from 'react-native';
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type TopBarProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DisplayForms' |'Home' |
    'ClaimMenu' | 'VehicleScreen' | 'ClaimSearcher' |
    'VehicleFineModal' | 'CommerceFineModal' | 'Printing' |
    'profile' | 'CommerceFineScreen' | 'ClaimScreen' |
    'VehicleSearcher' |'DisplayQuestions'
  >;
  isProfileScreen?: boolean; // Nuevo prop opcional
};

const SIDEBAR_WIDTH = 200;

export const TopBar = ({ navigation, isProfileScreen = false }: TopBarProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setSidebarVisible(false));
  };

  return (
    <View style={styles.container}>
      {/* Hamburguesa o X */}
      {isProfileScreen ? (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="close" size={30} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={openSidebar}>
          <FontAwesome name="bars" size={30} style={styles.icon} />
        </TouchableOpacity>
      )}
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../../assets/rlinklogo.png')}
          style={{width: 100, height: 40}}
        />
      </TouchableOpacity>

      {/* Sidebar Modal con animación */}
      {!isProfileScreen && (
        <Modal
          visible={sidebarVisible}
          transparent
          animationType="none"
          onRequestClose={closeSidebar}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeSidebar}
          >
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
              <TouchableOpacity
                style={styles.sidebarOption}
                onPress={() => {
                  closeSidebar();
                  navigation.navigate('profile');
                }}
              >
                <FontAwesome name="user" size={22} color="#333" />
                <Text style={styles.sidebarText}>Perfil</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    alignSelf: 'stretch',
    height: height * 0.1,
    minWidth: width,
  },
  icon: {
    fontSize: 30,
    marginRight: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    height: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  sidebarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarText: {
    fontSize: 18,
    marginLeft: 12,
    color: '#333',
  },
});