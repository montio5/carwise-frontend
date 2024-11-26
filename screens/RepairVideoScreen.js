import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Video } from 'expo-av';
import { getCarRepairVideos } from '../api/UserCar'; // Adjust the path to your API function
import {useTranslation} from 'react-i18next'

const RepairVideosScreen = ({ route }) => {
  const carModel = route.params?.car_model;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { t } = useTranslation();

  // Fetch videos from API
  const fetchVideos = useCallback(async () => {
    try {
      setError(null);
      const data = await getCarRepairVideos(carModel);
      setVideos(data);
    } catch (err) {
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [carModel]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedVideo(item.url)}
      activeOpacity={0.9}
    >
      <Text style={styles.title}>{item.get_category_display}</Text>
      <Text style={styles.subtitle}>{item.get_type_display}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !error && videos.length === 0 && (
        <Text style={styles.emptyStateText}>No repair videos found for {carModel}.</Text>
      )}
      {!loading && !error && (
        <FlatList
          data={videos}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          numColumns={2}
        />
      )}
      {selectedVideo && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: selectedVideo }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t("close")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    margin: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '90%',
    height: '50%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default RepairVideosScreen;
