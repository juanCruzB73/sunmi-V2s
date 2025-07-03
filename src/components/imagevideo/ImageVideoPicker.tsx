import React from 'react';
import { Image, StyleSheet } from 'react-native';

type Props = {
  uri: string | null;
};

const ImageVideoPicker: React.FC<Props> = ({ uri }) => {
  if (!uri) return null;
  return (
    <Image
      source={{ uri }}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
  },
});

export default ImageVideoPicker;