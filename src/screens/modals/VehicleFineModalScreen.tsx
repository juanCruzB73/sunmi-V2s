import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import VehicleInput from '../../components/fine/VehicleFineInput';

import { TopBar } from '../../components/top-bar/TopBar';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';
import SaveSuccesSnackbar from '../../components/fine/SaveSuccesSnackbar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import pickMedia from '../../utlis/ImagePickerService';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { fetchLocation } from '../../utlis/getLocatiom';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleFineModal'>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 16,
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
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancel: {
    marginTop: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewScroll: {
    marginVertical: 8,
    minHeight: 80,
  },
  previewContainer: {
    marginRight: 12,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  previewVideo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  removeIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 2,
  },
  removeIconText: {
    fontSize: 14,
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 8,
  },
  viewerCloseText: {
    fontSize: 16,
    color: '#333',
  },
  viewerImage: {
    width: '90%',
    height: '70%',
  },
  viewerVideo: {
    width: '90%',
    height: '70%',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
  },
});

export const VehicleFineModalScreen = ({ navigation }: Props) => {
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
    fecha: '', // Added fecha property
  });
  
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  const [calleModal, setCalleModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [mediaViewer, setMediaViewer] = useState<{ uri: string; type: string } | null>(null);
  const [mediaPreviewList, setMediaPreviewList] = useState<{ uri: string; type: string }[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleChange = (field: keyof typeof vehicle, value: string) => {
    setVehicle({ ...vehicle, [field]: value });
  };
const showDatePicker = () => setDatePickerVisibility(true);
const hideDatePicker = () => setDatePickerVisibility(false);
const handleConfirmDate = (date: Date) => {
  const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`; // formato DD/MM/YYYY
  handleChange('fecha', formatted);
  hideDatePicker();
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
      fecha: '', // Reset fecha as well
    });
    setMediaPreviewList([]);
  };

  const handleSave = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleMediaSource = async (source: 'camera' | 'gallery', type: 'photo' | 'video') => {
    const media = await pickMedia(source, type);
    if (!media) return;
    setMediaPreviewList(prev => [...prev, { uri: media.uri!, type: media.type! }]);
  };

  const handleRemoveMediaItem = (index: number) => {
    setMediaPreviewList(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenMedia = (item: { uri: string; type: string }) => {
    setMediaViewer(item);
  };


  const closeMediaViewer = () => {
    setMediaViewer(null);
  };
  const handleGetLocation = async () => {
    await fetchLocation(location, setLocation);
  };

  const gravedadOptions = ['Grave', 'Moderado', 'Leve'];
  const calleOptions = ['Avenida Libertador', 'Calle San Martín', 'Boulevard Roca'];
  const delitos = ['Estacionamiento indebido', 'Exceso de velocidad', 'Sin documentación'];

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Selector gravedad */}
          <Pressable style={styles.selectButton} onPress={() => setGravedadModal(true)}>
            <Text style={styles.selectButtonText}>
              {vehicle.gravedad || 'Gravedad'}
            </Text>
          </Pressable>
          <Modal visible={gravedadModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={gravedadOptions}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        handleChange('gravedad', item);
                        setGravedadModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </Pressable>
                  )}
                />
                <Pressable style={styles.modalCancel} onPress={() => setGravedadModal(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Inputs personalizados */}
          <VehicleInput label="Patente" value={vehicle.patente} onChangeText={v => handleChange('patente', v)} />
          <VehicleInput label="Marca" value={vehicle.marca} onChangeText={v => handleChange('marca', v)} />
          <VehicleInput label="Modelo" value={vehicle.modelo} onChangeText={v => handleChange('modelo', v)} />
          <VehicleInput label="Color" value={vehicle.color} onChangeText={v => handleChange('color', v)} />

          {/* Selector de tipo de delito */}
          <Pressable style={styles.selectButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectButtonText}>
              {vehicle.tipo || 'Tipo de delito'}
            </Text>
          </Pressable>
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={delitos}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        handleChange('tipo', item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </Pressable>
                  )}
                />
                <Pressable style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Numeración */}
          <VehicleInput label="Numeración" value={vehicle.numeracion} onChangeText={v => handleChange('numeracion', v)} />

          {/* Multimedia */}
          <Pressable
            style={styles.selectButton}
            onPress={() => {
              Alert.alert('Origen', '¿Qué querés hacer?', [
                { text: 'Tomar foto', onPress: () => handleMediaSource('camera', 'photo') },
                { text: 'Grabar video', onPress: () => handleMediaSource('camera', 'video') },
                { text: 'Galería', onPress: () => handleMediaSource('gallery', 'photo') },
                { text: 'Cancelar', style: 'cancel' },
              ]);
            }}
          >
            <Text style={styles.selectButtonText}>Imagen/Video 📷</Text>
          </Pressable>

          {/* Galería horizontal */}
          {mediaPreviewList.length > 0 && (
            <ScrollView horizontal style={styles.previewScroll} showsHorizontalScrollIndicator={false}>
              {mediaPreviewList.map((item, index) => (
                <View key={index} style={styles.previewContainer}>
                  <Pressable onPress={() => handleOpenMedia(item)}>
                    {item.type.startsWith('image') ? (
                      <Image source={{ uri: item.uri }} style={styles.previewImage} />
                    ) : (
                      <Video source={{ uri: item.uri }} style={styles.previewVideo} paused resizeMode="cover" />
                    )}
                  </Pressable>
                  <Pressable style={styles.removeIcon} onPress={() => handleRemoveMediaItem(index)}>
                    <Text style={styles.removeIconText}>❌</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Viewer modal pantalla completa */}
          {mediaViewer && (
            <Modal visible transparent animationType="fade" onRequestClose={closeMediaViewer}>
              <View style={styles.viewerOverlay}>
                <Pressable style={styles.viewerClose} onPress={closeMediaViewer}>
                  <Text style={styles.viewerCloseText}>Cerrar ✖️</Text>
                </Pressable>
                {mediaViewer.type.startsWith('image') ? (
                  <Image source={{ uri: mediaViewer.uri }} style={styles.viewerImage} resizeMode="contain" />
                ) : (
                  <Video
                    source={{ uri: mediaViewer.uri }}
                    style={styles.viewerVideo}
                    controls
                    paused={false}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Modal>
          )}
          {/* Ubicación */}
                  <Pressable style={styles.selectButton} onPress={handleGetLocation}>
                    <Text style={styles.selectButtonText}>Obtener Ubicación 📍</Text>
                  </Pressable>
                   {location && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16 }}>Latitud: {location.latitude}</Text>
                  <Text style={{ fontSize: 16 }}>Longitud: {location.longitude}</Text>
                </View>
              )}
          

          {/* Descripción */}
          <TextInput
            style={styles.textArea}
            placeholder="Descripción del hecho"
            value={vehicle.descripcion}
            onChangeText={v => handleChange('descripcion', v)}
            multiline
          />

          {/* Footer */}
          <View style={styles.footer}>
            <VehicleCommerceFooterButtons
              onCancel={() => {}}
              onClear={handleClear}
              onSave={handleSave}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <SaveSuccesSnackbar visible={showSnackbar} />
    </>
  );

};


