import React, { useEffect, useState } from 'react';
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar'
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Optional: Get current state immediately
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Cleanup the listener on unmount
    };
  }, []);

  useEffect(()=>{
    const getForms=async()=>{
      dispatch(startLoadForms());
    }
    getForms();
  },[])

  return (
    <>
      <TopBar navigation={navigation} />
      <Text>
        {isConnected === null
          ? 'Checking connection...'
          : isConnected
          ? 'You are online ✅'
          : 'No internet connection ❌'}
      </Text>
      <View style={styles.container}>
        {[
          { label: 'Formularios', route: 'DisplayForms' },
          //{ label: 'Multas', route: 'FineSearcher' },
          { label: 'Otros', route: undefined }
        ].map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={() => item.route && navigation.navigate({ name: item.route as any, params: undefined })}
          >
            <Text style={styles.text}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  )
}

const { width } = Dimensions.get('window');
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
});

export default HomeScreen