import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Modal, FlatList, TextInput, Image, Alert, GestureResponderEvent } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceFineInput from '../../components/fine/CommerceFineInput';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';
import SaveSuccesSnackbar from '../../components/fine/SaveSuccesSnackbar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';
import Video from 'react-native-video';
import { fetchLocation } from '../../utlis/getLocatiom';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceFineModal'>;


export const CommerceFineModalScreen = ({navigation}:Props) => {
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

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  const [calleModal, setCalleModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
   const [mediaViewer, setMediaViewer] = useState<{ uri: string; type: string } | null>(null);
    const [mediaPreviewList, setMediaPreviewList] = useState<{ uri: string; type: string }[]>([]);

  // Tipado correcto para navegación
  //const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      setMediaPreviewList([]);

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

  const handleSave = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
    // Aquí puedes agregar lógica adicional de guardado si lo necesitas
  };

  const delitos = [
    'Tipo 1',
    'Tipo 2',
    'Tipo 3',
  ];

  const gravedadOptions = ['Option1', 'Option2', 'Option3'];
  const calleOptions = ['Calle 1', 'Calle 2', 'Calle 3'];

  function handleMediaSource(arg0: string, arg1: string) {
    throw new Error('Function not implemented.');
  }

 const handleGetLocation=async()=>{
    await fetchLocation(location,setLocation);
  }

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
        {/* Botón para grabar audio */}
        <TouchableOpacity style={styles.selectButton} onPress={handleGetLocation}>
          <Text style={styles.selectButtonText}>Obtener Ubicación</Text>
        </TouchableOpacity>

        {
            location!==null?(
            <>
              <Text >latitud: {location.latitude}</Text>
              <Text >longitud: {location.longitude}</Text>
            </>
          ):
          (<></>)
        }

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
  previewScroll: {
    marginBottom: 16,
  },
  previewContainer: {
    position: 'relative',
    marginRight: 12,
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
    backgroundColor: '#000',
  },
  removeIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
  },
  removeIconText: {
    color: '#fff',
    fontSize: 14,
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