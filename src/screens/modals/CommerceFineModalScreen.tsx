import React, { useState } from 'react';
import {ScrollView,View,Pressable,Text,TextInput,Alert,Image,Modal} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';

import CommerceFineInput from '../../components/fine/CommerceFineInput';
import VehicleCommerceFooterButtons from '../../components/fine/VehicleCommerceFooterButtons';
import SaveSuccesSnackbar from '../../components/fine/SaveSuccesSnackbar';
import { TopBar } from '../../components/top-bar/TopBar';
import SelectModal from '../../components/modal/SelectModal';

import fineModalStyles from '../../styles/fineModalStyles';

import { useFineModalHandlers } from '../../hooks/useFineModalHandlers';
import { useCommerceForm } from '../../hooks/useCommerceForm';
import pickMedia from '../../utlis/ImagePickerService';
import { fetchLocation } from '../../utlis/getLocatiom';


type Props = NativeStackScreenProps<RootStackParamList, 'VehicleFineModal'>;

export const VehicleFineModalScreen = ({ navigation }: Props) => {
  const { commerce, handleChange, handleReset, formatDate } = useCommerceForm();
  const [gravedadModal, setGravedadModal] = useState(false);
  const [tipoModal, setTipoModal] = useState(false);

  
  const gravedadOptions = ['Grave', 'Moderado', 'Leve'];
  const delitos = ['Tipo 1', 'Tipo 2', 'Tipo 3'];

  const {
  showSnackbar,
  showDate,
  location,
  mediaViewer,
  mediaPreviewList,
  handleShowDate,
  handleMediaSource,
  handleRemoveMediaItem,
  handleOpenMedia,
  handleCloseMediaViewer,
  handleGetLocation,
  handleClear,
  handleSave,
} = useFineModalHandlers({ formatDate, handleChange, handleReset });

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={fineModalStyles.container}>
          <Pressable style={fineModalStyles.selectButton} onPress={() => setGravedadModal(true)}>
            <Text style={fineModalStyles.selectButtonText}>
              {commerce.gravedad || 'Gravedad'}
            </Text>
          </Pressable>
          <SelectModal
            visible={gravedadModal}
            options={gravedadOptions}
            onSelect={(item: string) => {
              handleChange('gravedad', item);
              setGravedadModal(false);
            }}
            onCancel={() => setGravedadModal(false)}
          />

          <CommerceFineInput label="RUT" value={commerce.rutcommerce} onChangeText={v => handleChange('rutcommerce', v)} />
          <CommerceFineInput label="Registro de Comercio" value={commerce.commerceregister} onChangeText={v => handleChange('commerceregister', v)} />
          <CommerceFineInput label="Numeracion" value={commerce.numeracion} onChangeText={v => handleChange('numeracion', v)} />

          <Pressable style={fineModalStyles.selectButton} onPress={() => handleShowDate(new Date())}>
            <Text style={fineModalStyles.selectButtonText}>
              {showDate ? commerce.fecha : 'Ingresar Fecha'}
            </Text>
          </Pressable>

          <Pressable style={fineModalStyles.selectButton} onPress={() => setTipoModal(true)}>
            <Text style={fineModalStyles.selectButtonText}>
              {commerce.tipo || 'Tipo de delito'}
            </Text>
          </Pressable>
          <SelectModal
            visible={tipoModal}
            options={delitos}
            onSelect={(item: string) => {
              handleChange('tipo', item);
              setTipoModal(false);
            }}
            onCancel={() => setTipoModal(false)}
          />

                  <CommerceFineInput
            label="Numeración"
            value={commerce.numeracion}
            onChangeText={v => handleChange('numeracion', v)}
          />

          <Pressable
            style={fineModalStyles.selectButton}
            onPress={() => {
              Alert.alert('Origen', '¿Qué querés hacer?', [
                { text: 'Tomar foto', onPress: () => handleMediaSource('camera', 'photo') },
                { text: 'Grabar video', onPress: () => handleMediaSource('camera', 'video') },
                { text: 'Galería', onPress: () => handleMediaSource('gallery', 'photo') },
                { text: 'Cancelar', style: 'cancel' },
              ]);
            }}
          >
            <Text style={fineModalStyles.selectButtonText}>Imagen/Video</Text>
          </Pressable>

          {mediaPreviewList.length > 0 && (
            <ScrollView horizontal style={fineModalStyles.previewScroll} showsHorizontalScrollIndicator={false}>
              {mediaPreviewList.map((item, index) => (
                <View key={index} style={fineModalStyles.previewContainer}>
                  <Pressable onPress={() => handleOpenMedia(item)}>
                    {item.type.startsWith('image') ? (
                      <Image source={{ uri: item.uri }} style={fineModalStyles.previewImage} />
                    ) : (
                      <Video source={{ uri: item.uri }} style={fineModalStyles.previewVideo} paused resizeMode="cover" />
                    )}
                  </Pressable>
                  <Pressable style={fineModalStyles.removeIcon} onPress={() => handleRemoveMediaItem(index)}>
                    <Text style={fineModalStyles.removeIconText}>X</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {mediaViewer && (
            <Modal visible transparent animationType="fade" onRequestClose={handleCloseMediaViewer}>
              <View style={fineModalStyles.viewerOverlay}>
                <Pressable style={fineModalStyles.viewerClose} onPress={handleCloseMediaViewer}>
                  <Text style={fineModalStyles.viewerCloseText}>Cerrar</Text>
                </Pressable>
                {mediaViewer.type.startsWith('image') ? (
                  <Image source={{ uri: mediaViewer.uri }} style={fineModalStyles.viewerImage} resizeMode="contain" />
                ) : (
                  <Video
                    source={{ uri: mediaViewer.uri }}
                    style={fineModalStyles.viewerVideo}
                    controls
                    paused={false}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Modal>
          )}

          <Pressable style={fineModalStyles.selectButton} onPress={handleGetLocation}>
            <Text style={fineModalStyles.selectButtonText}>Obtener Ubicación</Text>
          </Pressable>
          {location && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16 }}>Latitud: {location.latitude}</Text>
              <Text style={{ fontSize: 16 }}>Longitud: {location.longitude}</Text>
            </View>
          )}

          <TextInput
            style={fineModalStyles.textArea}
            placeholder="Descripción del hecho"
            value={commerce.descripcion}
            onChangeText={v => handleChange('descripcion', v)}
            multiline
          />

          <View style={fineModalStyles.footer}>
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
