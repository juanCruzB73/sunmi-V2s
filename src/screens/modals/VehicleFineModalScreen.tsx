import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
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
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import pickMedia from '../../utlis/ImagePickerService';
import Video from 'react-native-video';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleFineModal'>;

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
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  const [calleModal, setCalleModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [mediaViewer, setMediaViewer] = useState<{ uri: string; type: string } | null>(null);
  const [mediaPreviewList, setMediaPreviewList] = useState<{ uri: string; type: string }[]>([]);

const handleChange = (field: keyof typeof vehicle, value: string) => {
  setVehicle({ ...vehicle, [field]: value });
};

const handleRemoveMediaItem = (index: number) => {
  setMediaPreviewList(prev => prev.filter((_, i) => i !== index));
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
  setMediaPreviewList([]);
};
const handleOpenMedia = (item: { uri: string; type: string }) => {
  setMediaViewer(item);
};
const closeMediaViewer = () => {
  setMediaViewer(null);
};


const handleSave = () => {
  setShowSnackbar(true);
  setTimeout(() => setShowSnackbar(false), 2000);
};

const handleRemoveMedia = () => {
  setMediaPreviewList([]);
};

const handleMediaSource = async (source: 'camera' | 'gallery', type: 'photo' | 'video') => {
  const media = await pickMedia(source, type);

  // Si el usuario cancela, simplemente salimos silenciosamente:
  if (!media) return;

  // Si llega hasta acá, entonces sí es válido:
  setMediaPreviewList(prev => [...prev, { uri: media.uri!, type: media.type! }]);
};

  const delitos = ['Tipo 1', 'Tipo 2', 'Tipo 3'];
  const gravedadOptions = ['Option1', 'Option2', 'Option3'];
  const calleOptions = ['Calle 1', 'Calle 2', 'Calle 3'];

  return (
    <>
      <TopBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator>
        {/* Gravedad */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setGravedadModal(true)}>
          <Text style={styles.selectButtonText}>
            {vehicle.gravedad ? vehicle.gravedad : 'Gravedad'}
          </Text>
        </TouchableOpacity>
        <Modal visible={gravedadModal} transparent animationType="slide">
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
              <TouchableOpacity style={styles.modalCancel} onPress={() => setGravedadModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Calle */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setCalleModal(true)}>
          <Text style={styles.selectButtonText}>
            {vehicle.calle ? vehicle.calle : 'Calle'}
          </Text>
        </TouchableOpacity>
        <Modal visible={calleModal} transparent animationType="slide">
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
              <TouchableOpacity style={styles.modalCancel} onPress={() => setCalleModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Inputs */}
        <VehicleInput label="Patente" value={vehicle.patente} onChangeText={(v) => handleChange('patente', v)} />
        <VehicleInput label="Marca" value={vehicle.marca} onChangeText={(v) => handleChange('marca', v)} />
        <VehicleInput label="Modelo" value={vehicle.modelo} onChangeText={(v) => handleChange('modelo', v)} />
        <VehicleInput label="Color" value={vehicle.color} onChangeText={(v) => handleChange('color', v)} />

        {/* Tipo de delito */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.selectButtonText}>
            {vehicle.tipo ? vehicle.tipo : 'Tipo de delito'}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
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
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <VehicleInput label="Numeración" value={vehicle.numeracion} onChangeText={(v) => handleChange('numeracion', v)} />

        {/* Imagen/Video Picker */}
<View>
  {/* Botón principal con menú de opciones */}
  <TouchableOpacity
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
  </TouchableOpacity>

  {/* Previews horizontales */}
  {mediaPreviewList.length > 0 && (
    <ScrollView horizontal style={styles.previewScroll} showsHorizontalScrollIndicator={false}>
      {mediaPreviewList.map((item, index) => (
        <View key={index} style={styles.previewContainer}>
          <TouchableOpacity onPress={() => handleOpenMedia(item)}>
            {item.type.startsWith('image') ? (
              <Image source={{ uri: item.uri }} style={styles.previewImage} />
            ) : (
              <Video
                source={{ uri: item.uri }}
                style={styles.previewVideo}
                resizeMode="cover"
                paused={true}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemoveMediaItem(index)}>
            <Text style={styles.removeIconText}>❌</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )}

  {/* Visualizador modal en pantalla completa */}
  {mediaViewer && (
    <Modal visible transparent animationType="fade" onRequestClose={closeMediaViewer}>
      <View style={styles.viewerOverlay}>
        <TouchableOpacity style={styles.viewerClose} onPress={closeMediaViewer}>
          <Text style={styles.viewerCloseText}>Cerrar ✖️</Text>
        </TouchableOpacity>
        {mediaViewer.type.startsWith('image') ? (
          <Image
            source={{ uri: mediaViewer.uri }}
            style={styles.viewerImage}
            resizeMode="contain"
          />
        ) : (
          <Video
          source={{ uri: mediaViewer.uri }}
          style={styles.viewerVideo}
          controls
          resizeMode="contain"
          paused={false}
          onError={(e) => console.log('Error al reproducir video:', e)}
        />
        )}
      </View>
    </Modal>
  )}
</View>

        {/* Audio */}
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Grabar audio 🎤</Text>
        </TouchableOpacity>

        {/* Descripción */}
        <TextInput
          style={styles.textArea}
          placeholder="Descripción del hecho"
          value={vehicle.descripcion}
          onChangeText={(v) => handleChange('descripcion', v)}
          multiline
          numberOfLines={4}
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
  previewScroll: {
    marginBottom: 16,
    paddingVertical: 8,
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
  previewContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  previewWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 130,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  previewText: {
    fontSize: 16,
    color: '#333',
  },
  previewVideo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    zIndex: 1,
  },
  removeIconText: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
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
    // (Removed: setMediaPreviewList function is now handled by useState)
    paddingVertical: 8,
  },
  viewerVideo: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#000',
  },
  viewerClose: {
    alignSelf: 'flex-end',
    margin: 16,
    zIndex: 2,
  },
  viewerCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});

function setMediaPreviewList(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
