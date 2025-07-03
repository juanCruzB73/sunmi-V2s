import React from 'react'
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native'
import { TopBar } from '../../components/top-bar/TopBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <View style={styles.container}>
        {[
          { label: 'Automóviles', route: 'VehicleScreen' },
          { label: 'Comercio', route: 'CommerceMenu' },
          { label: 'Multas', route: 'FineSearcher' },
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