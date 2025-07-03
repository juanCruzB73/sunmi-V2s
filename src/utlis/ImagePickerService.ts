// src/utils/imagePickerService.ts

import * as ImagePicker from 'react-native-image-picker';
import { Asset } from 'react-native-image-picker';

const MAX_FILE_SIZE_MB = 50 * 1024; // 50GB en MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

const isValidAsset = (asset?: Asset): boolean => {
  if (!asset || !asset.fileSize || !asset.type) return false;

  const sizeInMB = asset.fileSize / (1024 * 1024);
  const isSizeValid = sizeInMB <= MAX_FILE_SIZE_MB;
  const isTypeValid = ALLOWED_TYPES.includes(asset.type);

  return isSizeValid && isTypeValid;
};

// 👉 Configura opciones según el tipo deseado
const getOptions = (source: 'camera' | 'gallery', type: 'photo' | 'video') => {
  return {
    mediaType: type,
    videoQuality: 'high' as 'high' | 'low' | 'medium',
    durationLimit: 60,
    saveToPhotos: true,
  };
};

const pickMedia = async (
  source: 'camera' | 'gallery',
  type: 'photo' | 'video'
): Promise<Asset | null> => {
  const launcher =
    source === 'camera' ? ImagePicker.launchCamera : ImagePicker.launchImageLibrary;
  const options = getOptions(source, type);

  try {
    const result = await launcher(options);

    if (result.didCancel) {
      console.log('Usuario canceló la selección');
      return null;
    }

    if (result.errorCode) {
      console.error('Error con el picker:', result.errorMessage);
      return null;
    }

    const asset = result.assets?.[0];

    if (!isValidAsset(asset)) {
      console.warn('Archivo inválido: tipo o tamaño no permitido');
      return null;
    }

    return asset ?? null;
  } catch (error) {
    console.error('Error inesperado en el picker:', error);
    return null;
  }
};

export default pickMedia;