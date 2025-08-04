import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';
import { IAnswer } from '../../types/claims/IAnswer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { ClaimType, onSetActiveClaim } from '../../redux/slices/claims/claimSlice';
import { IClaim } from '../../types/claims/IClaim';
import { unSyncedClaim } from '../../types/unSyncedClaim';

interface ICardProps {
  claim: ClaimType;
}

const InfoCard: FC<ICardProps> = ({ claim }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  function isIClaim(claim: IClaim | unSyncedClaim): claim is IClaim {
    return (claim as IClaim).answers !== undefined;
  }

  const handlePrint = async () => {
    navigation.navigate('Printing');

    setTimeout(async () => {
      try {
        await SunmiPrinterLibrary.prepare();
        await SunmiPrinterLibrary.printText('🧾 OFFICIAL TICKET\n');
        await SunmiPrinterLibrary.printText('----------------------\n');
        await SunmiPrinterLibrary.printText(`📄 Claim ID: ${claim.id}\n`);
        await SunmiPrinterLibrary.printText(`📌 Type: ${claim.type}\n`);
        await SunmiPrinterLibrary.printText(`📅 Date: ${claim.date}\n`);
        await SunmiPrinterLibrary.printText(`📍 Status: ${claim.status?.toUpperCase() ?? 'N/A'}\n`);

        if ('plateOrRut' in claim && claim.plateOrRut) {
          await SunmiPrinterLibrary.printText(`🔖 Identificador: ${claim.plateOrRut}\n`);
        }

        await SunmiPrinterLibrary.printText('----------------------\n');

        if (isIClaim(claim)) {
          for (const answer of claim.answers) {
            await SunmiPrinterLibrary.printText(
              `${answer.question?.name ?? 'Pregunta'}: ${answer.input_string}\n`
            );
          }
        } else {
          for (const answer of claim.answers_attributes) {
            await SunmiPrinterLibrary.printText(
              `Pregunta ${answer.question_id}: ${answer.input_string}\n`
            );
          }
        }

        await SunmiPrinterLibrary.printText('----------------------\n');
        await SunmiPrinterLibrary.printText('✅ Gracias\n\n\n');

        Alert.alert('Impresión exitosa', 'El ticket fue impreso correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        Alert.alert('Error de impresión', errorMessage, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    }, 300);
  };

  return (
    <TouchableOpacity
      style={claim.isSynced ? styles.cardSynced : styles.cardUnsynced}
      onPress={() => {
        dispatch(onSetActiveClaim(claim));
        navigation.navigate('ClaimScreen');
      }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.claimId}>ID: {claim.id}</Text>
          {'date' in claim && <Text style={styles.date}>Fecha: {claim.date}</Text>}
          <Text style={styles.syncStatus}>
            Estado: {claim.isSynced ? '✅ Sincronizado' : '❌ No sincronizado'}
          </Text>
        </View>

        <View style={styles.divider} />

        <ScrollView style={styles.answersContainer}>
          {isIClaim(claim)
            ? claim.answers.map((answer: IAnswer) => (
                <View key={answer.id} style={styles.answerRow}>
                  <Text style={styles.question}>
                    {answer.question?.name ?? 'Pregunta'}:
                  </Text>
                  <Text style={styles.answer}>{answer.input_string}</Text>
                </View>
              ))
            : claim.answers_attributes.map((answer, idx) => (
                <View key={idx} style={styles.answerRow}>
                  <Text style={styles.question}>Pregunta {answer.question_id}:</Text>
                  <Text style={styles.answer}>{answer.input_string}</Text>
                </View>
              ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
        <FontAwesome name="print" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardSynced: {
    backgroundColor: '#E8F8F5',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },
  cardUnsynced: {
    backgroundColor: '#FDEDEC',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 10,
  },
  claimId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  syncStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#34495e',
  },
  divider: {
    height: 1,
    backgroundColor: '#dcdde1',
    marginVertical: 10,
  },
  answersContainer: {
    maxHeight: 180,
  },
  answerRow: {
    marginBottom: 8,
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  answer: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  printButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default InfoCard;