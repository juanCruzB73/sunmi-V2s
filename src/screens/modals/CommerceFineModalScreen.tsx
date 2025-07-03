// Primera parte del componente embellecido
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  FlatList,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceFineInput from '../../components/fine/CommerceFineInput';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';
import SaveSuccesSnackbar from '../../components/fine/SaveSuccesSnackbar';
import Video from 'react-native-video';
import { fetchLocation } from '../../utlis/getLocatiom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceFineModal'>;

export const CommerceFineModalScreen = ({ navigation }: Props) => {
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

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [gravedadModal, setGravedadModal] = useState(false);
  const [calleModal, setCalleModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [mediaViewer, setMediaViewer] = useState<{ uri: string; type: string } | null>(null);
  const [mediaPreviewList, setMediaPreviewList] = useState<{ uri: string; type: string }[]>([]);

  const handleChange = (field: keyof typeof commerce, value: string) => {
    setCommerce({ ...commerce, [field]: value });
  };
  
  // Estilos para el componente
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 32,
    },
    selectButton: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#cfd8dc',
      alignItems: 'center',
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
      padding: 20,
      width: '80%',
      maxHeight: '60%',
      alignItems: 'stretch',
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
      marginTop: 16,
      alignItems: 'center',
    },
    modalCancelText: {
      color: '#1976d2',
      fontWeight: 'bold',
      fontSize: 16,
    },
    previewScroll: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    previewContainer: {
      marginRight: 12,
      alignItems: 'center',
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
      top: -8,
      right: -8,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 2,
      elevation: 2,
    },
    removeIconText: {
      fontSize: 16,
      color: '#e53935',
    },
    viewerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewerClose: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 2,
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 8,
    },
    viewerCloseText: {
      fontSize: 16,
      color: '#333',
    },
    viewerImage: {
      width: 320,
      height: 320,
      borderRadius: 8,
    },
    viewerVideo: {
      width: 320,
      height: 320,
      borderRadius: 8,
      backgroundColor: '#000',
    },
    textArea: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      minHeight: 80,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: '#cfd8dc',
      marginBottom: 16,
      fontSize: 16,
    },
    footer: {
      marginTop: 16,
      marginBottom: 32,
    },
  });

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

  const handleSave = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleMediaSource = async (source: 'camera' | 'gallery', type: 'photo' | 'video') => {
    console.warn('Integrar lógica real con pickMedia');
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

  const gravedadOptions = ['Alta', 'Media', 'Leve'];
  const calleOptions = ['Calle 1', 'Calle 2', 'Calle 3'];
  const delitos = ['Tipo 1', 'Tipo 2', 'Tipo 3'];

  return (
    <React.Fragment>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
                      {/* Selector gravedad */}
        <Pressable style={styles.selectButton} onPress={() => setGravedadModal(true)}>
          <Text style={styles.selectButtonText}>
            {commerce.gravedad || 'Gravedad'}
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

        {/* Selector calle */}
        <Pressable style={styles.selectButton} onPress={() => setCalleModal(true)}>
          <Text style={styles.selectButtonText}>
            {commerce.calle || 'Calle'}
          </Text>
        </Pressable>
        <Modal visible={calleModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={calleOptions}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('calle', item);
                      setCalleModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </Pressable>
                )}
              />
              <Pressable style={styles.modalCancel} onPress={() => setCalleModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Campos base */}
        <CommerceFineInput label="RUT Comercio" value={commerce.rutcommerce} onChangeText={(v) => handleChange('rutcommerce', v)} />
        <CommerceFineInput label="Registro" value={commerce.commerceregister} onChangeText={(v) => handleChange('commerceregister', v)} />
        <CommerceFineInput label="Modelo" value={commerce.modelo} onChangeText={(v) => handleChange('modelo', v)} />

        {/* Tipo de delito */}
        <Pressable style={styles.selectButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.selectButtonText}>
            {commerce.tipo || 'Tipo de delito'}
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
        <CommerceFineInput label="Numeración" value={commerce.numeracion} onChangeText={(v) => handleChange('numeracion', v)} />

        {/* Multimedia */}
        <Pressable
          style={styles.selectButton}
          onPress={() =>
            Alert.alert('Origen', '¿Qué querés hacer?', [
              { text: 'Tomar foto', onPress: () => handleMediaSource('camera', 'photo') },
              { text: 'Grabar video', onPress: () => handleMediaSource('camera', 'video') },
              { text: 'Galería', onPress: () => handleMediaSource('gallery', 'photo') },
              { text: 'Cancelar', style: 'cancel' },
            ])
          }
        >
          <Text style={styles.selectButtonText}>Imagen/Video 📷</Text>
        </Pressable>

        {mediaPreviewList.length > 0 && (
          <ScrollView horizontal style={styles.previewScroll}>
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

        {/* Viewer de medios */}
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
                  resizeMode="contain"
                  paused={false}
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
          value={commerce.descripcion}
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
      <SaveSuccesSnackbar visible={showSnackbar} />
        </LinearGradient>
    </React.Fragment>
  );
};