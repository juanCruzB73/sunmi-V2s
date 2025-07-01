import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import VehicleInput from '../../components/fine/VehicleFineInput';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';  
import { TopBar } from '../../components/top-bar/TopBar';
import { TouchableOpacity, Text, Modal, FlatList } from 'react-native';

export const VehicleFineModalScreen: React.FC = () => {
  const [vehicle, setVehicle] = useState({
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: '',
    anio: '',
  });

  const [modalVisible, setModalVisible] = useState(false);

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
    });
  };

  // Cambia los textos para que sean claros y únicos
  const delitos = [
    'Tipo 1',
    'Tipo 2',
    'Tipo 3',
    'Tipo 4',
    'Tipo 5',
  ];

  return (
    <> 
      <TopBar />
      <ScrollView contentContainerStyle={styles.container}>
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
            {vehicle.tipo ? vehicle.tipo : 'Seleccionar tipo de delito'}
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

        <VehicleInput label="Año" value={vehicle.anio} keyboardType="numeric" onChangeText={(v) => handleChange('anio', v)} />

        <View style={styles.footer}>
          <VehicleCommerceFooterButtons
            onCancel={() => {}}
            onClear={handleClear}
            onSave={() => {
              // guardar info o continuar
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
  },
  footer: {
    marginTop: 24,
  },
  selectButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 18,
    color: '#333',
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
});