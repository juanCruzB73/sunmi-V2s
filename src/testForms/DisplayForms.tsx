import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { IForm } from '../types/form/IForm';
import { FormCard } from './FormCard';
import { TopBar } from '../components/top-bar/TopBar';
import { RootStackParamList } from '../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onSetActiveForm } from '../redux/slices/form/formSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayForms'>;

export const DisplayForms = ({ navigation }: Props) => {
  const { forms } = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const handlePress = async (form: IForm) => {
    setLoading(true);
    await dispatch(onSetActiveForm(form));
    navigation.navigate('ClaimMenu');
    setLoading(false);
  };

  if (!Array.isArray(forms)) {
    return <Text style={{ padding: 20 }}>Loading Forms...</Text>;
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      {forms.map((form) => (
        <TouchableOpacity key={form.id.toString()} onPress={() => handlePress(form)}>
          <FormCard form={form} />
        </TouchableOpacity>
      ))}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f5f6fa',
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