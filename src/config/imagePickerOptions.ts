// src/config/imagePickerOptions.ts

import { ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';

export const cameraOptions: CameraOptions = {
  mediaType: 'mixed',       // Permite imágenes y videos
  quality: 0.8,              // Calidad de compresión
  saveToPhotos: false,
  includeBase64: false,     // Solo si necesitás el archivo en base64
};

export const galleryOptions: ImageLibraryOptions = {
  mediaType: 'mixed',
  selectionLimit: 1,         // Cambiar a 0 si querés permitir múltiples
  includeBase64: false,
};