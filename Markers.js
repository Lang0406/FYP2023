import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal, Button, Alert } from 'react-native';
import { db } from './firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const Markers = () => {
  const route = useRoute();
  const [markers, setMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerData, setNewMarkerData] = useState({
    title: '',
    color: '',
    route: '',
    coordinate: { latitude: '', longitude: '' }
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMarkersFromFirebase = async () => {
      try {
        const markersSnapshot = await db.collection('markers').get();
        const markersData = markersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMarkers(markersData);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    fetchMarkersFromFirebase();
  }, []);

  const handleAddMarker = () => {
    setModalVisible(true);
  };

  const handleEditMarker = (marker) => {
    setSelectedMarker(marker);
    setNewMarkerData({
      title: marker.title,
      color: marker.color,
      route: marker.route,
      coordinate: { latitude: marker.coordinate.latitude, longitude: marker.coordinate.longitude }
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedMarker(null);
    setModalVisible(false);
    setNewMarkerData({
      title: '',
      color: '',
      route: '',
      coordinate: { latitude: '', longitude: '' }
    });
  };

  const handleMarkerSubmission = async () => {
    try {
      if (selectedMarker) {
        // Delete existing marker
        await db.collection('markers').doc(selectedMarker.id).delete();
      }
      // Add new marker
      const newMarker = await db.collection('markers').add(newMarkerData);
      // Update markers state with new data
      const markersSnapshot = await db.collection('markers').get();
      const markersData = markersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarkers(markersData);
      // Close modal and reset form data
      handleModalClose();
    } catch (error) {
      console.error('Error adding/editing marker:', error);
    }
  };

  const handleDeleteMarker = async (markerId) => {
    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await db.collection('markers').doc(markerId).delete();
              // Update markers state after deletion
              const updatedMarkers = markers.filter(marker => marker.id !== markerId);
              setMarkers(updatedMarkers);
            } catch (error) {
              console.error('Error deleting marker:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for marker"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddMarker}>
        <Text style={styles.addButtonText}>Add Marker</Text>
      </TouchableOpacity>
      <FlatList
        data={markers.filter(marker => marker.title.toLowerCase().includes(searchTerm.toLowerCase()))}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.markerContainer}>
            <Text style={styles.markerTitle}>Title: {item.title}</Text>
            <Text style={styles.markerDescription}>Latitude: {item.coordinate.latitude}</Text>
            <Text style={styles.markerDescription}>Longitude: {item.coordinate.longitude}</Text>
            <Text style={styles.markerDescription}>Route: {item.route}</Text>
            <Text style={styles.markerDescription}>Color: {item.color}</Text>
            <View style={styles.markerButtonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditMarker(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMarker(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal visible={modalVisible} animationType="slide">
        {/* Modal content */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  markerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  markerDescription: {
    fontSize: 16,
  },
  markerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default Markers;
