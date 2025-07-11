import { useState } from 'react';
import pickMedia from '../utlis/ImagePickerService';
import { fetchLocation } from '../utlis/getLocatiom';

type MediaItem = { uri: string; type: string };
type SourceType = 'camera' | 'gallery';
type MediaType = 'photo' | 'video';

interface Options {
  formatDate: (date: Date) => string;
  handleChange: (field: any, value: string) => void;
  handleReset: () => void;
}

export const useFineModalHandlers = ({
  formatDate,
  handleChange,
  handleReset,
}: Options) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mediaViewer, setMediaViewer] = useState<MediaItem | null>(null);
  const [mediaPreviewList, setMediaPreviewList] = useState<MediaItem[]>([]);

  const handleShowDate = (date: Date) => {
    setShowDate(true);
    handleChange('fecha', formatDate(date));
  };

  const handleMediaSource = async (source: SourceType, type: MediaType) => {
    const media = await pickMedia(source, type);
    if (media) {
      setMediaPreviewList(prev => [...prev, { uri: media.uri!, type: media.type! }]);
    }
  };

  const handleRemoveMediaItem = (index: number) => {
    setMediaPreviewList(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenMedia = (item: MediaItem) => {
    setMediaViewer(item);
  };

  const handleCloseMediaViewer = () => {
    setMediaViewer(null);
  };

  const handleGetLocation = async () => {
    await fetchLocation(location, setLocation);
  };

  const handleClear = () => {
    handleReset();
    setMediaPreviewList([]);
  };

  const handleSave = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  return {
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
  };
};