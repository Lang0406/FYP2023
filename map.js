import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { db } from './firebase'; 

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    tilt: 45,
  });
  const [searchText, setSearchText] = useState('');
  const [searchLocation, setSearchLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        console.log('Location:', location);

        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMarkersFromFirebase = async () => {
      try {
        const markersSnapshot = await db.collection('markers').get();
        const markersData = markersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMarkers(markersData);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    getLocationAsync();
    fetchMarkersFromFirebase();
  }, []);

  const handleSearch = async () => {
    try {
      const apiKey = 'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'; 
      const encodedSearchText = encodeURIComponent(searchText);
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedSearchText}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setSearchLocation({ latitude: lat, longitude: lng });
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const handleMarkerSelect = (markerId) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setRegion({
        ...region,
        latitude: parseFloat(marker.coordinate.latitude),
        longitude: parseFloat(marker.coordinate.longitude),
      });
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a location"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      <TouchableOpacity style={styles.selectedMarkerContainer} onPress={() => setShowPicker(!showPicker)}>
        <TextInput
          style={styles.selectedMarkerText}
          placeholder="Select a marker..."
          value={selectedMarker ? selectedMarker.title : ''}
          editable={false}
        />
      </TouchableOpacity>

      {showPicker && (
        <FlatList
          style={styles.markerPicker}
          data={markers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMarkerSelect(item.id)}>
              <Text style={styles.markerPickerItem}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: parseFloat(region.latitude),
            longitude: parseFloat(region.longitude),
          }}
          title="Current Location"
        />
        
        {searchLocation && (
          <Marker
            coordinate={{
              latitude: parseFloat(searchLocation.latitude),
              longitude: parseFloat(searchLocation.longitude),
            }}
            title="Search Location"
          />
        )}

        {searchLocation && (
          <MapViewDirections
            origin={{
              latitude: parseFloat(region.latitude),
              longitude: parseFloat(region.longitude),
            }}
            destination={{
              latitude: parseFloat(searchLocation.latitude),
              longitude: parseFloat(searchLocation.longitude),
            }}
            apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
            mode="WALKING"
            strokeWidth={3}
            strokeColor={`#${Math.floor(Math.random() * 16777215).toString(16)}`} 
          />
        )}

        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: parseFloat(marker.coordinate.latitude),
              longitude: parseFloat(marker.coordinate.longitude),
            }}
            title={marker.title}
            pinColor={marker.color}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectedMarkerContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMarkerText: {
    fontSize: 16,
  },
  markerPicker: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    height: 200,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 1,
  },
  markerPickerItem: {
    fontSize: 16,
    padding: 10,
  },
});

export default Map;
