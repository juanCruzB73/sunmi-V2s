import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Modal, FlatList, TextInput } from 'react-native';
import VehicleInput from '../../components/fine/VehicleFineInput';
import { TopBar } from '../../components/top-bar/TopBar';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';
import SaveSuccesSnackbar from '../../components/fine/SaveSuccesSnackbar';
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type Props = NativeStackScreenProps<RootStackParamList, 'VehicleFineModal'>;


export const VehicleFineModalScreen = ({navigation}:Props) => {
  const [vehicle, setVehicle] = useState({
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: '',
    anio: '',
    gravedad: '',
    calle: '',
    numeracion: '',
    descripcion: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  const [calleModal, setCalleModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (field: keyof typeof vehicle, value: string) => {
    setVehicle({ ...vehicle, [field]: value });
  };

  const handleClear = () => {
    setVehicle({
      patente: '',
      marca: '',
      modelo: '',
      color: '',
      tipo: '',
      anio: '',
      gravedad: '',
      calle: '',
      numeracion: '',
      descripcion: '',
    });
  };

  const handleSave = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const delitos = [
    'Tipo 1',
    'Tipo 2',
    'Tipo 3',
  ];

  const gravedadOptions = ['Option1', 'Option2', 'Option3'];
  const calleOptions = ['Calle 1', 'Calle 2', 'Calle 3'];

  return (
    <> 
      <TopBar navigation={navigation}/>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator>
        {/* Gravedad Dropdown */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setGravedadModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {vehicle.gravedad ? vehicle.gravedad : 'Gravedad'}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={gravedadModal}
          transparent
          animationType="slide"
          onRequestClose={() => setGravedadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={gravedadOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('gravedad', item);
                      setGravedadModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setGravedadModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Calle Dropdown */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setCalleModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {vehicle.calle ? vehicle.calle : 'Calle'}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={calleModal}
          transparent
          animationType="slide"
          onRequestClose={() => setCalleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={calleOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('calle', item);
                      setCalleModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCalleModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Campos originales */}
        <VehicleInput label="Patente" value={vehicle.patente} onChangeText={(v) => handleChange('patente', v)} />
        <VehicleInput label="Marca" value={vehicle.marca} onChangeText={(v) => handleChange('marca', v)} />
        <VehicleInput label="Modelo" value={vehicle.modelo} onChangeText={(v) => handleChange('modelo', v)} />
        <VehicleInput label="Color" value={vehicle.color} onChangeText={(v) => handleChange('color', v)} />

        {/* Botón para seleccionar tipo de delito */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>
            {vehicle.tipo ? vehicle.tipo : 'Tipo de delito'}
          </Text>
        </TouchableOpacity>

        {/* Modal para elegir tipo de delito */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={delitos}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('tipo', item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Numeración */}
        <VehicleInput label="Numeración" value={vehicle.numeracion} onChangeText={(v) => handleChange('numeracion', v)} />

        {/* Imagen/Video (solo icono, funcionalidad aparte) */}
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Imagen/Video 📷</Text>
        </TouchableOpacity>

        {/* Botón para grabar audio */}
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Grabar audio 🎤</Text>
        </TouchableOpacity>

        {/* Editor de texto enriquecido (solo textarea simple aquí) */}
        <TextInput
          style={styles.textArea}
          placeholder="Descripción del hecho"
          value={vehicle.descripcion}
          onChangeText={(v) => handleChange('descripcion', v)}
          multiline
          numberOfLines={4}
        />

        {/* Botones de pie de página */}
        <View style={styles.footer}>
          <VehicleCommerceFooterButtons
            onCancel={() => {}}
            onClear={handleClear}
            onSave={handleSave}
          />
        </View>
      </ScrollView>
      <SaveSuccesSnackbar visible={showSnackbar} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  footer: {
    marginTop: 24,
  },
  selectButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 18,
    color: '#004d9a',
  },
  modalCancel: {
    marginTop: 16,
    padding: 10,
  },
  modalCancelText: {
    color: '#d32f2f',
    fontSize: 16,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});