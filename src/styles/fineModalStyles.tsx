import { StyleSheet } from 'react-native';
const fineModalStyles = StyleSheet.create({
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
export default fineModalStyles;