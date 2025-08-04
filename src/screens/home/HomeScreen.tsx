import React, { useEffect, useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { startLoadForms } from '../../redux/slices/form/formThunk';
import NetInfo from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { forms } = useSelector((state: RootState) => state.form);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    dispatch(startLoadForms());
  }, []);

  const handleNavigate = async (route: keyof RootStackParamList | undefined) => {
    if (!route) return;
    setLoading(true);
    // Optional delay to show spinner clearly
    setTimeout(() => {
      navigation.navigate(route);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <TopBar navigation={navigation} />
      <Text style={{ textAlign: 'center', marginVertical: 10 }}>
        {isConnected === null
          ? 'Checking connection...'
          : isConnected
          ? 'You are online ✅'
          : 'No internet connection ❌'}
      </Text>

      <View style={styles.container}>
        {[
          { label: 'Formularios', route: 'DisplayForms' },
          { label: 'Otros', route: undefined },
        ].map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleNavigate(item.route)}
          >
            <Text style={styles.text}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '80%',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    width: width * 0.8,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default HomeScreen;