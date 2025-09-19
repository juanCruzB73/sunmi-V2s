import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceButton from '../../components/commerce/CommerceButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { IQuestion } from '../../types/form/IQuestion';
import { startLoadQuestions } from '../../redux/slices/question/questionThunk';
import { onLoadQuestions } from '../../redux/slices/question/questionSlice';
import { startGetClaims } from '../../redux/slices/claims/claimThunk';
import { onSetActiveClaim } from '../../redux/slices/claims/claimSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimMenu'>;

const ClaimMenu = ({ navigation }: Props) => {
  const { activeForm } = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [loadingMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    let loadedQuestions: IQuestion[] = [];
    const result = await dispatch(startLoadQuestions(activeForm!.id));

    if ('payload' in result! && Array.isArray(result.payload)) {
      loadedQuestions = result.payload;
    }

    const filtered = loadedQuestions.filter(
      (q) => Array.isArray(q.question_options) && q.question_options.length > 0
    );

    filtered.length<1 ? dispatch(onLoadQuestions(loadedQuestions)) : dispatch(onLoadQuestions(filtered));
    dispatch(onSetActiveClaim(null));
    navigation.navigate('DisplayQuestions');
    setLoading(false);
  };

  const handleList = async () => {
    setLoading(true);
    await dispatch(startGetClaims(activeForm!.id));
    navigation.navigate('ClaimSearcher');
    setLoading(false);
  };

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f2f6fc', '#dde9f7']} style={styles.gradient}>
        <View style={styles.container}>
          <CommerceButton
            label={`Generar ${activeForm?.name}`}
            onPress={handleGenerate}
          />
          <CommerceButton
            label={`Listar ${activeForm?.name}`}
            onPress={handleList}
          />
        </View>
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        )}
      </LinearGradient>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'stretch',
    paddingBottom: 60,
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
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ClaimMenu;