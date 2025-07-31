import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"; // ✅ Agregalo acá
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { IAnswer } from '../../types/claims/IAnswer';
import { startLoadQuestionsByPanel } from '../../redux/slices/question/questionThunk';
import { startDeleteClaim } from '../../redux/slices/claims/claimThunk';
import { IClaim } from '../../types/claims/IClaim';
import { unSyncedClaim } from '../../types/unSyncedClaim';
import { unSyncedAnswer } from '../../types/unSyncedAnswer';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimScreen'>;

export const ClaimScreen = ({ navigation }: Props) => {
  const { activeForm } = useSelector((state: RootState) => state.form);
  const { activeClaim } = useSelector((state: RootState) => state.claim);
  const dispatch = useDispatch<AppDispatch>();
  
  function isIClaim(claim: IClaim | unSyncedClaim): claim is IClaim {
    return (claim as IClaim).answers !== undefined;
  }

  if (!activeClaim)return<><TopBar navigation={navigation} /><Text>No se selecciono Solicitud</Text></>
  if (!activeForm)return<><TopBar navigation={navigation} /><Text>No se selecciono Formulario</Text></>
  
  const handleClickEdit=()=>{
    if(isIClaim(activeClaim))dispatch(startLoadQuestionsByPanel(activeForm!.id,activeClaim.main_panel_id));
  };

  const handleDeleteClaim=()=>{
    if(isIClaim(activeClaim))dispatch(startDeleteClaim(activeClaim.id))
  };
  
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Datos de solicitud</Text>

          <View style={styles.card}>
            {isIClaim(activeClaim)
              ? activeClaim.answers.map((answer: IAnswer) => (
                  <Text key={answer.id}>
                    {answer.question?.name ?? 'Pregunta sin nombre'}: {answer.input_string}
                  </Text>
                ))
              : activeClaim.answers_attributes.map((answer: unSyncedAnswer, index) => (
                  <Text key={index}>
                    Pregunta {answer.question_id}: {answer.input_string}
                  </Text>
                ))
            }
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressed
              ]}
              onPress={handleClickEdit}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.buttonDelete,
                pressed && styles.buttonPressed
              ]}
              onPress={handleDeleteClaim}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* ✅ Confirmación Modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Eliminar solicitud?</Text>
            <Text style={styles.modalText}>Esta acción es permanente. ¿Estás seguro?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.buttonConfirm, styles.modalButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Sí, eliminar</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonDelete, styles.modalButton]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: '#f5f7fa',
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
    gap: 10,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
  },
  buttonConfirm: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    width: width * 0.8,
    elevation: 4,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    width: width * 0.3,
  },
});