import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Modal, FlatList, TextInput } from 'react-native';

import { TopBar } from '../../components/top-bar/TopBar';
import CommerceFineInput from '../../components/fine/CommerceFineInput';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';

export const CommerceFineModalScreen: React.FC = () => {
  const [commerce, setCommerce] = useState({
    rutcommerce: '',
    commerceregister: '',
    modelo: '',
    tipo: '',
    anio: '',
    gravedad: '',
    calle: '',
    numeracion: '',
    descripcion: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  // const [comunaModal, setComunaModal] = useState(false); // Quitado
  const [calleModal, setCalleModal] = useState(false);

  const handleChange = (field: keyof typeof commerce, value: string) => {
    setCommerce({ ...commerce, [field]: value });
  };

  const handleClear = () => {
    setCommerce({
      rutcommerce: '',
      commerceregister: '',
      modelo: '',
      tipo: '',
      anio: '',
      gravedad: '',
      calle: '',
      numeracion: '',
      descripcion: '',
    });
  };

  const delitos = [
    'Tipo 1',
    'Tipo 2',
    'Tipo 3',
  ];

  const gravedadOptions = ['Option1', 'Option2', 'Option3'];
  // const comunaOptions = ['Comuna 1', 'Comuna 2', 'Comuna 3']; // Quitado
  const calleOptions = ['Calle 1', 'Calle 2', 'Calle 3'];

  return (
    <> 
      <TopBar />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator>
        {/* Gravedad Dropdown */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setGravedadModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {commerce.gravedad ? commerce.gravedad : 'Gravedad'}
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
            {commerce.calle ? commerce.calle : 'Calle'}
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
        <CommerceFineInput label="Rut Comercio" value={commerce.rutcommerce} onChangeText={(v) => handleChange('rutcommerce', v)} />
        <CommerceFineInput label="Registro Comercio" value={commerce.commerceregister} onChangeText={(v) => handleChange('commerceregister', v)} />
        <CommerceFineInput label="Modelo" value={commerce.modelo} onChangeText={(v) => handleChange('modelo', v)} />

        {/* Botón para seleccionar tipo de delito */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>
            {commerce.tipo ? commerce.tipo : 'Tipo de delito'}
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
        <CommerceFineInput label="Numeración" value={commerce.numeracion} onChangeText={(v) => handleChange('numeracion', v)} />

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
          value={commerce.descripcion}
          onChangeText={(v) => handleChange('descripcion', v)}
          multiline
          numberOfLines={4}
        />

        {/* Botones de pie de página */}
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